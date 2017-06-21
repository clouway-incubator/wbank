package api

import (
	"encoding/json"
	"github.com/iliyanmotovski/bankv1/bank/domain"
	"net/http"
	"time"
)

func SignUpHandler(userStore domain.UserStore) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var request domain.UserRegistrationRequest
		json.NewDecoder(r.Body).Decode(&request)
		w.Header().Set("Content-Type", "application/json")

		u, err := userStore.RegisterUser(request)
		if err == nil {
			responseUser := &domain.ResponseUser{UserID: u.UserID, Username: u.Username, Email: u.Email, Name: u.Name, Age: u.Age, DateCreated: time.Now().Local()}
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(responseUser)
			return
		}

		switch err {
		case domain.ErrUserAlreadyExists:
			errorResponse(w, http.StatusBadRequest, "SignUp Failed", "user", "username", "already_exist")
		case domain.ErrEmailAlreadyExists:
			errorResponse(w, http.StatusBadRequest, "SignUp Failed", "user", "email", "already_exist")
		default:
			errorResponse(w, http.StatusInternalServerError, "SignUp Failed", "error", "unexpected_error", err.Error())
		}
	})
}

func LoginHandler(userStore domain.UserStore, sessionStore domain.SessionStore, userSessionDuration time.Duration) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("SID")
		if err != nil {
			cookie = &http.Cookie{Value: "rfBd56ti2SMtY"}
		}

		w.Header().Set("Content-Type", "application/json")

		_, ok := sessionStore.FindSessionAvailableAt(cookie.Value, time.Now().Local())
		if ok {
			errorResponse(w, http.StatusBadRequest, "Login Failed", "user", "user_status", "already_logged_in")
			return
		}

		var request domain.UserLoginRequest
		json.NewDecoder(r.Body).Decode(&request)

		user, err := userStore.Authenticate(request)
		if err != nil {
			switch err {
			case domain.ErrUsernameDoesntExist:
				errorResponse(w, http.StatusNotFound, "Login Failed", "user", "username", "username_does_not_exist")
				return
			case domain.ErrAlreadyLoggedIn:
				errorResponse(w, http.StatusBadRequest, "Login Failed", "user", "user_status", "already_logged_in")
				return
			case domain.ErrWrongPassword:
				errorResponse(w, http.StatusUnauthorized, "Login Failed", "user", "password", "wrong_password")
				return
			default:
				errorResponse(w, http.StatusInternalServerError, "Login Failed", "error", "unexpected_error", err.Error())
				return
			}
		}

		session, err := sessionStore.StartSession(*user, time.Now().Local().Add(userSessionDuration))
		if err != nil {
			errorResponse(w, http.StatusInternalServerError, "Session Initializing Failed", "error", "unexpected_error", err.Error())
			return
		}

		json.NewEncoder(w).Encode(session)
	})
}

func LogoutHandler(sessionStore domain.SessionStore) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("SID")
		if err != nil {
			cookie = &http.Cookie{Value: "rfBd56ti2SMtY"}
		}

		w.Header().Set("Content-Type", "application/json")

		session, ok := sessionStore.FindSessionAvailableAt(cookie.Value, time.Now().Local())
		if !ok {
			errorResponse(w, http.StatusBadRequest, "Logout Failed", "user", "user_status", "already_logged_out")
			return
		}

		err = sessionStore.DeleteSession(session.SessionID)
		if err != nil {
			errorResponse(w, http.StatusInternalServerError, "Logout Failed", "error", "unexpected_error", err.Error())
			return
		}
	})
}
