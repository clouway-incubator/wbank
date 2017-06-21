package api_test

import (
	"encoding/json"
	"errors"
	"github.com/golang/mock/gomock"
	"github.com/gorilla/context"
	"github.com/iliyanmotovski/bankv1/bank/api"
	"github.com/iliyanmotovski/bankv1/bank/domain"
	"github.com/justinas/alice"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
	"time"
)

func TestSecurityPassesAndSessionIsUpdated(t *testing.T) {
	testHandler := func() http.HandlerFunc {
		fn := func(w http.ResponseWriter, r *http.Request) {
			session := context.Get(r, "session").(*domain.Session)
			if session.SessionID != "12345" {
				t.Error("expected SessionID to be '12345', but it wasn't")
			}
		}
		return http.HandlerFunc(fn)
	}

	account := []domain.Account{}
	account = append(account, domain.Account{UserID: "12345", AccountID: "54321", Currency: "BGN", Amount: 100})

	r := httptest.NewRequest("POST", "/deposit", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(&domain.Session{SessionID: "12345"}, true)
	mockSessionStore.EXPECT().UpdateSession(gomock.Any(), gomock.Any()).Return(nil)

	security := alice.New(api.CookieBasedSecurity(mockSessionStore, time.Second))

	security.Then(testHandler()).ServeHTTP(w, r)

	if w.Code != http.StatusOK {
		t.Errorf("wrong status: expected %d, got %d", http.StatusOK, w.Code)
	}
}

func TestSessionWasNotValid(t *testing.T) {
	testHandler := func() http.HandlerFunc {
		fn := func(w http.ResponseWriter, r *http.Request) {
			t.Error("should not have entered testHandler")
		}
		return http.HandlerFunc(fn)
	}

	r := httptest.NewRequest("POST", "/deposit", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(&domain.Session{}, false)

	security := alice.New(api.CookieBasedSecurity(mockSessionStore, time.Second))
	security.Then(testHandler()).ServeHTTP(w, r)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("wrong status: expected %d, got %d", http.StatusUnauthorized, w.Code)
	}
}

func TestUpdateSessionFailed(t *testing.T) {
	testHandler := func() http.HandlerFunc {
		fn := func(w http.ResponseWriter, r *http.Request) {
		}
		return http.HandlerFunc(fn)
	}

	account := []domain.Account{}
	account = append(account, domain.Account{UserID: "12345", AccountID: "54321", Currency: "BGN", Amount: 100})

	r := httptest.NewRequest("POST", "/deposit", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(&domain.Session{}, true)
	mockSessionStore.EXPECT().UpdateSession(gomock.Any(), gomock.Any()).Return(errors.New("persistence error while updating session"))

	security := alice.New(api.CookieBasedSecurity(mockSessionStore, time.Second))

	security.Then(testHandler()).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Session Update Failed","Resource":"error","Field":"unexpected_error","Code":"persistence error while updating session"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUserLogsInSuccessfully(t *testing.T) {
	r := httptest.NewRequest("POST", "/login", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(nil, false)
	mockUserStore.EXPECT().Authenticate(gomock.Any()).Return(new(domain.User), nil)
	mockSessionStore.EXPECT().StartSession(gomock.Any(), gomock.Any()).Return(&domain.Session{SessionID: "12345"}, nil)

	api.LoginHandler(mockUserStore, mockSessionStore, time.Second).ServeHTTP(w, r)

	if w.Code != http.StatusOK {
		t.Errorf("wrong status: expected %d, got %d", http.StatusOK, w.Code)
	}
}

func TestIfUserIsAlreadyLoggedIn(t *testing.T) {
	r := httptest.NewRequest("POST", "/login", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(nil, true)

	api.LoginHandler(mockUserStore, mockSessionStore, time.Second).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Login Failed","Resource":"user","Field":"user_status","Code":"already_logged_in"}`)

	if w.Code != http.StatusBadRequest {
		t.Errorf("wrong status: expected %d, got %d", http.StatusBadRequest, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestInvalidUsernameWasPassed(t *testing.T) {
	r := httptest.NewRequest("POST", "/login", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(nil, false)
	mockUserStore.EXPECT().Authenticate(gomock.Any()).Return(nil, domain.ErrUsernameDoesntExist)

	api.LoginHandler(mockUserStore, mockSessionStore, time.Second).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Login Failed","Resource":"user","Field":"username","Code":"username_does_not_exist"}`)

	if w.Code != http.StatusNotFound {
		t.Errorf("wrong status: expected %d, got %d", http.StatusNotFound, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestIfUserIsAlreadyLoggedInAndPersonFromAnotherLocationTriesToLogin(t *testing.T) {
	r := httptest.NewRequest("POST", "/login", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(nil, false)
	mockUserStore.EXPECT().Authenticate(gomock.Any()).Return(nil, domain.ErrAlreadyLoggedIn)

	api.LoginHandler(mockUserStore, mockSessionStore, time.Second).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Login Failed","Resource":"user","Field":"user_status","Code":"already_logged_in"}`)

	if w.Code != http.StatusBadRequest {
		t.Errorf("wrong status: expected %d, got %d", http.StatusBadRequest, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestIfUsernameIsCorrectButPasswordIsWrong(t *testing.T) {
	r := httptest.NewRequest("POST", "/login", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(nil, false)
	mockUserStore.EXPECT().Authenticate(gomock.Any()).Return(nil, domain.ErrWrongPassword)

	api.LoginHandler(mockUserStore, mockSessionStore, time.Second).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Login Failed","Resource":"user","Field":"password","Code":"wrong_password"}`)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("wrong status: expected %d, got %d", http.StatusUnauthorized, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestIfThereIsAnErrorWhileStartingTheSession(t *testing.T) {
	r := httptest.NewRequest("POST", "/login", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(nil, false)
	mockUserStore.EXPECT().Authenticate(gomock.Any()).Return(new(domain.User), nil)
	mockSessionStore.EXPECT().StartSession(gomock.Any(), gomock.Any()).Return(nil, errors.New("persistence error while starting the session"))

	api.LoginHandler(mockUserStore, mockSessionStore, time.Second).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Session Initializing Failed","Resource":"error","Field":"unexpected_error","Code":"persistence error while starting the session"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUserLogsOutSuccessfully(t *testing.T) {
	r := httptest.NewRequest("POST", "/logout", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(new(domain.Session), true)
	mockSessionStore.EXPECT().DeleteSession(gomock.Any()).Return(nil)

	api.LogoutHandler(mockSessionStore).ServeHTTP(w, r)

	if w.Code != http.StatusOK {
		t.Errorf("wrong status: expected %d, got %d", http.StatusOK, w.Code)
	}
}

func TestIfUserIsAlreadyLoggedOut(t *testing.T) {
	r := httptest.NewRequest("POST", "/logout", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(nil, false)

	api.LogoutHandler(mockSessionStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Logout Failed","Resource":"user","Field":"user_status","Code":"already_logged_out"}`)

	if w.Code != http.StatusBadRequest {
		t.Errorf("wrong status: expected %d, got %d", http.StatusBadRequest, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestIfThereIsAnErrorWhileDeletingTheSession(t *testing.T) {
	r := httptest.NewRequest("POST", "/logout", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockSessionStore := domain.NewMockSessionStore(ctrl)

	mockSessionStore.EXPECT().FindSessionAvailableAt(gomock.Any(), gomock.Any()).Return(new(domain.Session), true)
	mockSessionStore.EXPECT().DeleteSession(gomock.Any()).Return(errors.New("persistance error while deleting the session"))

	api.LogoutHandler(mockSessionStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Logout Failed","Resource":"error","Field":"unexpected_error","Code":"persistance error while deleting the session"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUserSignsUpSuccessfully(t *testing.T) {
	r := httptest.NewRequest("POST", "/signup", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)

	mockUserStore.EXPECT().RegisterUser(gomock.Any()).Return(&domain.User{UserID: "12345", Username: "Test"}, nil)

	api.SignUpHandler(mockUserStore).ServeHTTP(w, r)

	responseUser := domain.ResponseUser{}

	json.NewDecoder(w.Body).Decode(&responseUser)

	if w.Code != http.StatusCreated {
		t.Errorf("wrong status: expected %d, got %d", http.StatusCreated, w.Code)
	}
	if responseUser.UserID != "12345" || responseUser.Username != "Test" {
		t.Errorf("handler returned unexpected body: Got id: %s username: %s .... Want id: %s username: %s",
			responseUser.UserID, responseUser.Username, "12345", "Test")
	}
}

func TestBadUsername(t *testing.T) {
	r := httptest.NewRequest("POST", "/signup", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)

	mockUserStore.EXPECT().RegisterUser(gomock.Any()).Return(nil, domain.ErrUserAlreadyExists)

	api.SignUpHandler(mockUserStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"SignUp Failed","Resource":"user","Field":"username","Code":"already_exist"}`)

	if w.Code != http.StatusBadRequest {
		t.Errorf("wrong status: expected %d, got %d", http.StatusBadRequest, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestBadEmail(t *testing.T) {
	r := httptest.NewRequest("POST", "/signup", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)

	mockUserStore.EXPECT().RegisterUser(gomock.Any()).Return(nil, domain.ErrEmailAlreadyExists)

	api.SignUpHandler(mockUserStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"SignUp Failed","Resource":"user","Field":"email","Code":"already_exist"}`)

	if w.Code != http.StatusBadRequest {
		t.Errorf("wrong status: expected %d, got %d", http.StatusBadRequest, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUnexpectedPersistenceError(t *testing.T) {
	r := httptest.NewRequest("POST", "/signup", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockUserStore := domain.NewMockUserStore(ctrl)

	mockUserStore.EXPECT().RegisterUser(gomock.Any()).Return(nil, errors.New("some persistence error"))

	api.SignUpHandler(mockUserStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"SignUp Failed","Resource":"error","Field":"unexpected_error","Code":"some persistence error"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}
