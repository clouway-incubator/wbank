package main

import (
	"flag"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/iliyanmotovski/bankv1/bank/api"
	"github.com/iliyanmotovski/bankv1/bank/persistence"
	"github.com/justinas/alice"
	"gopkg.in/mgo.v2"
)

var (
	dbHost = flag.String("db-host", "localhost:27017", "database host")
)

func main() {
	flag.Parse()

	fmt.Printf("Connecting to DB: %s\n", *dbHost)

	session, err := mgo.DialWithTimeout(*dbHost, time.Second*10)
	if err != nil {
		fmt.Printf("database cannot be reached due: %v", err)
		return
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)

	database := mgo.Database{Session: session, Name: "bank"}

	sessionStore := persistence.NewSessionStore(*database.Session, database.Name)
	userStore := persistence.NewUserStore(*database.Session, database.Name)
	accountStore := persistence.NewAccountStore(*database.Session, database.Name)

	r := mux.NewRouter()
	s := r.PathPrefix("/v1/users").Subrouter()

	userSessionDuration := time.Second * 300

	SignUpHandlers := alice.New(api.LoggingMiddleware, api.RecoverMiddleware)
	SecurityHandlers := alice.New(api.LoggingMiddleware, api.RecoverMiddleware, api.CookieBasedSecurity(sessionStore, userSessionDuration))

	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))
	s.Handle("/signup", SignUpHandlers.Then(api.SignUpHandler(userStore))).Methods("POST")
	s.Handle("/login", SignUpHandlers.Then(api.LoginHandler(userStore, sessionStore, userSessionDuration))).Methods("POST")
	s.Handle("/logout", SignUpHandlers.Then(api.LogoutHandler(sessionStore))).Methods("POST")
	s.Handle("/me/new-account", SecurityHandlers.Then(api.NewUserAccount(accountStore))).Methods("POST")
	s.Handle("/me/accounts", SecurityHandlers.Then(api.GetUserAccounts(accountStore))).Methods("GET")
	s.Handle("/me/delete-account", SecurityHandlers.Then(api.DeleteUserAccount(accountStore))).Methods("DELETE")
	s.Handle("/me/deposit", SecurityHandlers.Then(api.UserAccountDeposit(accountStore))).Methods("POST")
	s.Handle("/me/withdraw", SecurityHandlers.Then(api.UserAccountWithdraw(accountStore))).Methods("POST")
	s.Handle("/me/account-history", SecurityHandlers.Then(api.UserTransactionHistory(accountStore))).Methods("POST")

	http.ListenAndServe(":8080", r)
}
