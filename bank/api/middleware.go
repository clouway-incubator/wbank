package api

import (
	"github.com/gorilla/context"
	"github.com/iliyanmotovski/bankv1/bank/domain"
	"log"
	"net/http"
	"time"
)

// Provides cookie based security and updates the user with his most recent account information after
// every account operation related request.
func CookieBasedSecurity(sessionStore domain.SessionStore, userSessionDuration time.Duration) func(http.Handler) http.Handler {

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("SID")
			if err != nil {
				cookie = &http.Cookie{Value: "rfBd56ti2SMtY"}
			}

			session, ok := sessionStore.FindSessionAvailableAt(cookie.Value, time.Now().Local())
			if !ok {
				errorResponse(w, http.StatusUnauthorized, "Authorization Failed", "account", "account_authorization", "unauthorized")
				return
			}
			w.Header().Set("Content-Type", "application/json")

			context.Set(r, "session", session)
			next.ServeHTTP(w, r)

			err = sessionStore.UpdateSession(session.SessionID, time.Now().Local().Add(userSessionDuration))
			if err != nil {
				errorResponse(w, http.StatusInternalServerError, "Session Update Failed", "error", "unexpected_error", err.Error())
				return
			}
		})
	}
}

// Logs every incoming request. Useful for debugging.
func LoggingMiddleware(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		t1 := time.Now()
		next.ServeHTTP(w, r)
		t2 := time.Now()
		log.Printf("method: [%s] url: %q resptime: %v from: %s\n", r.Method, r.URL.String(), t2.Sub(t1), r.RemoteAddr)
	}

	return http.HandlerFunc(fn)
}

// Recovers if a panic occurs. Useful for debugging and not letting the server go down.
func RecoverMiddleware(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("panic: %+v", err)
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			}
		}()

		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}
