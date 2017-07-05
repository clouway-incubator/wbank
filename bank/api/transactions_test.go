package api_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/gorilla/context"
	"github.com/iliyanmotovski/bankv1/bank/api"
	"github.com/iliyanmotovski/bankv1/bank/domain"
)

func TestUserAccountIsDeleted(t *testing.T) {
	r := httptest.NewRequest("DELETE", "/delete-account?id=12345", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().DeleteAccount(gomock.Any(), gomock.Any()).Return(nil)

	context.Set(r, "session", &domain.Session{})
	api.DeleteUserAccount(mockAccountStore).ServeHTTP(w, r)

	if w.Code != http.StatusOK {
		t.Errorf("wrong status: expected %d, got %d", http.StatusOK, w.Code)
	}
}

func TestIfNoUrlArguments(t *testing.T) {
	r := httptest.NewRequest("DELETE", "/delete-account", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	context.Set(r, "session", &domain.Session{})
	api.DeleteUserAccount(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Delete User Account Failed","Resource":"request","Field":"URL_parameters","Code":"need_accountID_to_be_specified_in_URL"}`)

	if w.Code != http.StatusBadRequest {
		t.Errorf("wrong status: expected %d, got %d", http.StatusBadRequest, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestIfThereIsAnErrorWhileDeletingTheAccount(t *testing.T) {
	r := httptest.NewRequest("DELETE", "/delete-account?id=12345", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().DeleteAccount(gomock.Any(), gomock.Any()).Return(errors.New("persistence error while deleting the account"))

	context.Set(r, "session", &domain.Session{})
	api.DeleteUserAccount(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Delete User Accounts Failed","Resource":"error","Field":"unexpected_error","Code":"persistence error while deleting the account"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUserRequestsHisAccountsAndThereAreNoErrors(t *testing.T) {
	r := httptest.NewRequest("GET", "/accounts", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	account := []*domain.Account{}
	account = append(account, &domain.Account{UserID: "12345", AccountID: "54321", Currency: "BGN", Amount: 100, Type: "VISA"})
	account = append(account, &domain.Account{UserID: "54321", AccountID: "12345", Currency: "NGB", Amount: 200, Type: "AMERICAN"})

	mockAccountStore.EXPECT().GetAccounts(gomock.Any()).Return(account, nil)

	context.Set(r, "session", &domain.Session{})
	api.GetUserAccounts(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`[{"AccountID":"54321","UserID":"12345","Currency":"BGN","Amount":100,"Type":"VISA"},{"AccountID":"12345","UserID":"54321","Currency":"NGB","Amount":200,"Type":"AMERICAN"}]`)

	if w.Code != http.StatusOK {
		t.Errorf("wrong status: expected %d, got %d", http.StatusOK, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestIfThereIsAnErrorWhileFetchingTheAccounts(t *testing.T) {
	r := httptest.NewRequest("GET", "/accounts", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().GetAccounts(gomock.Any()).Return(nil, errors.New("persistence error while fitching user accounts"))

	context.Set(r, "session", &domain.Session{})
	api.GetUserAccounts(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Fetch User Accounts Failed","Resource":"error","Field":"unexpected_error","Code":"persistence error while fitching user accounts"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUserOpensNewAccountSuccessfully(t *testing.T) {
	r := httptest.NewRequest("POST", "/new-account", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().InsertAccount(gomock.Any(), gomock.Any()).Return("test", nil)

	context.Set(r, "session", &domain.Session{})
	api.NewUserAccount(mockAccountStore).ServeHTTP(w, r)

	if w.Code != http.StatusCreated {
		t.Errorf("wrong status: expected %d, got %d", http.StatusCreated, w.Code)
	}
}

func TestIfThereIsAnErrorWhileInsertingNewAccount(t *testing.T) {
	r := httptest.NewRequest("POST", "/new-account", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().InsertAccount(gomock.Any(), gomock.Any()).Return("test", errors.New("persistence error while inserting new user account"))

	context.Set(r, "session", &domain.Session{})
	api.NewUserAccount(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Create User Account Failed","Resource":"error","Field":"unexpected_error","Code":"persistence error while inserting new user account"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUserDepositsSuccessfully(t *testing.T) {
	r := httptest.NewRequest("POST", "/deposit", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().Deposit(gomock.Any()).Return(&domain.Account{Amount: 20}, nil)

	context.Set(r, "session", &domain.Session{})
	api.UserAccountDeposit(mockAccountStore).ServeHTTP(w, r)

	if w.Code != http.StatusOK {
		t.Errorf("wrong status: expected %d, got %d", http.StatusOK, w.Code)
	}
}

func TestIfThereIsAnErrorWhileDepositing(t *testing.T) {
	r := httptest.NewRequest("POST", "/deposit", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().Deposit(gomock.Any()).Return(nil, errors.New("persistence error while depositing"))

	context.Set(r, "session", &domain.Session{})
	api.UserAccountDeposit(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"User Account Deposit Failed","Resource":"error","Field":"unexpected_error","Code":"persistence error while depositing"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUserWithdrawsSuccessfully(t *testing.T) {
	r := httptest.NewRequest("POST", "/withdraw", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().Withdraw(gomock.Any()).Return(&domain.Account{}, nil)

	context.Set(r, "session", &domain.Session{})
	api.UserAccountWithdraw(mockAccountStore).ServeHTTP(w, r)

	if w.Code != http.StatusOK {
		t.Errorf("wrong status: expected %d, got %d", http.StatusOK, w.Code)
	}
}

func TestIfUserTriesToWithdrawMoreThanAvailableInTheAccount(t *testing.T) {
	r := httptest.NewRequest("POST", "/withdraw", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().Withdraw(gomock.Any()).Return(nil, domain.ErrWithdrawMoreThanHave)

	context.Set(r, "session", &domain.Session{})
	api.UserAccountWithdraw(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"User Account Withdraw Failed","Resource":"account","Field":"money_availability","Code":"cannot_withdraw_more_than_have_available"}`)

	if w.Code != http.StatusBadRequest {
		t.Errorf("wrong status: expected %d, got %d", http.StatusBadRequest, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestIfThereIsAnErrorWhileWithdrawing(t *testing.T) {
	r := httptest.NewRequest("POST", "/withdraw", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().Withdraw(gomock.Any()).Return(nil, errors.New("persistence error while withdrawing"))

	context.Set(r, "session", &domain.Session{})
	api.UserAccountWithdraw(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"User Account Withdraw Failed","Resource":"error","Field":"unexpected_error","Code":"persistence error while withdrawing"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUserIsAuthenticatedAndRequestsHistory(t *testing.T) {
	r := httptest.NewRequest("POST", "/history", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	instant, _ := time.Parse("Jan 2, 2006 at 3:04pm (MST)", "Feb 3, 2013 at 7:54pm (UTC)")
	history := []domain.History{}
	history = append(history, domain.History{UserID: "12345", AccountID: "54321", TransactionType: "deposit", Amount: 100, Date: instant})

	mockAccountStore.EXPECT().GetHistory(gomock.Any()).Return(&history, nil)

	context.Set(r, "session", &domain.Session{})
	api.UserTransactionHistory(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`[{"AccountID":"54321","UserID":"12345","TransactionType":"deposit","Currency":"","Amount":100,"Date":"2013-02-03T19:54:00Z"}]`)

	if w.Code != http.StatusOK {
		t.Errorf("wrong status: expected %d, got %d", http.StatusOK, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestUserIsNotAuthorizedToSeeTheAccountHistory(t *testing.T) {
	r := httptest.NewRequest("POST", "/history", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().GetHistory(gomock.Any()).Return(nil, domain.ErrUnauthorized)

	context.Set(r, "session", &domain.Session{})
	api.UserTransactionHistory(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Fetch User Account History Failed","Resource":"account","Field":"account_authorization","Code":"unauthorized_to_see_this_account_history"}`)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("wrong status: expected %d, got %d", http.StatusUnauthorized, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}

func TestIfThereIsAnErrorWhileFetchingTheRequestedAccountHistory(t *testing.T) {
	r := httptest.NewRequest("POST", "/history", nil)
	w := httptest.NewRecorder()

	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockAccountStore := domain.NewMockAccountStore(ctrl)

	mockAccountStore.EXPECT().GetHistory(gomock.Any()).Return(nil, errors.New("persistence error while fetching the account history"))

	context.Set(r, "session", &domain.Session{})
	api.UserTransactionHistory(mockAccountStore).ServeHTTP(w, r)

	expected := []byte(`{"Message":"Fetch User Account History Failed","Resource":"error","Field":"unexpected_error","Code":"persistence error while fetching the account history"}`)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("wrong status: expected %d, got %d", http.StatusInternalServerError, w.Code)
	}
	if !reflect.DeepEqual(w.Body.Bytes()[:len(w.Body.Bytes())-1], expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			w.Body.String(), string(expected))
	}
}
