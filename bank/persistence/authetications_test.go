package persistence_test

import (
	"github.com/iliyanmotovski/bankv1/bank/domain"
	"github.com/iliyanmotovski/bankv1/bank/persistence"
	"github.com/iliyanmotovski/bankv1/bank/persistence/testdb"
	"reflect"
	"testing"
	"time"
)

func TestItStartsUpdatesAndDeletesSession(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	sessionStore := persistence.NewSessionStore(*db.Database.Session, db.Database.Name)

	startInstant, _ := time.Parse("Jan 2, 2006 at 3:04pm (MST)", "Feb 3, 2013 at 7:54pm (UTC)")
	updatedInstant, _ := time.Parse("Jan 2, 2006 at 3:04pm (MST)", "Feb 13, 2013 at 7:54pm (UTC)")

	testUser := domain.User{UserID: "54321"}

	userSession, err := sessionStore.StartSession(testUser, startInstant)
	if err != nil {
		t.Error(err.Error())
	}

	expected := domain.Session{UserID: "54321", SessionID: userSession.SessionID, Expires: updatedInstant}

	sessionStore.UpdateSession(userSession.SessionID, expected.Expires)

	result, _ := sessionStore.FindSessionAvailableAt(userSession.SessionID, startInstant)
	result.Expires = result.Expires.UTC()

	if !reflect.DeepEqual(*result, expected) {
		t.Errorf("expected session: %v got: %v", expected, *result)
	}

	result.SessionID = ""

	sessionStore.DeleteSession(userSession.SessionID)

	result, _ = sessionStore.FindSessionAvailableAt(userSession.SessionID, startInstant)

	if result.SessionID != "" {
		t.Error("expected to have 0 accounts in the DB, but there was more")
	}
}

func TestItChecksSessionIsValidAtAGivenTimeInstant(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	sessionStore := persistence.NewSessionStore(*db.Database.Session, db.Database.Name)

	expires, _ := time.Parse("Jan 2, 2006 at 3:04pm (MST)", "Feb 3, 2013 at 7:54pm (EET)")
	validInstant, _ := time.Parse("Jan 2, 2006 at 3:04pm (MST)", "Feb 3, 2013 at 7:53pm (EET)")
	invalidInstant, _ := time.Parse("Jan 2, 2006 at 3:04pm (MST)", "Feb 3, 2013 at 7:55pm (EET)")

	testUser := domain.User{UserID: "54321"}

	userSession, _ := sessionStore.StartSession(testUser, expires)

	_, ok := sessionStore.FindSessionAvailableAt(userSession.SessionID, validInstant)
	if ok != true {
		t.Error("expected session to be valid, but it wasn't")
	}

	_, ok = sessionStore.FindSessionAvailableAt(userSession.SessionID, invalidInstant)
	if ok != false {
		t.Error("expected session to be invalid, but it wasn't")
	}
}

func TestItRegistersAndAuthenticatesUser(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	userStore := persistence.NewUserStore(*db.Database.Session, db.Database.Name)

	user := domain.UserRegistrationRequest{Username: "user", Password: "pass", Name: "name", Email: "email", Age: 10}

	_, err := userStore.RegisterUser(user)
	if err != nil {
		t.Error(err.Error())
	}

	result, err := userStore.Authenticate(domain.UserLoginRequest{Username: "user", Password: "pass"})
	if err != nil {
		t.Error(err.Error())
	}

	if result.Username != user.Username || result.Name != user.Name || result.Email != user.Email || result.Age != user.Age {
		t.Errorf("expected User: %v, %v, %v, %v got: %v, %v, %v, %v", user.Username, user.Name, user.Email, user.Age,
			result.Username, result.Name, result.Email, result.Age)
	}
}

func TestIfUsernameDoesNotExist(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	userStore := persistence.NewUserStore(*db.Database.Session, db.Database.Name)

	_, err := userStore.Authenticate(domain.UserLoginRequest{Username: "user", Password: "pass"})
	if err == nil {
		t.Error("expected Authenticate to return error, but it didn't")
	}
}

func TestIfPasswordIsWrong(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	userStore := persistence.NewUserStore(*db.Database.Session, db.Database.Name)

	user := domain.UserRegistrationRequest{Username: "user", Password: "pass", Name: "name", Email: "email", Age: 10}

	_, err := userStore.RegisterUser(user)
	if err != nil {
		t.Error(err.Error())
	}

	_, err = userStore.Authenticate(domain.UserLoginRequest{Username: "user", Password: "ssap"})
	if err == nil {
		t.Error("expected Authenticate to return error, but it didn't")
	}
}

func TestIfUserLogsInWhileAlreadyLoggedIn(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	sessionStore := persistence.NewSessionStore(*db.Database.Session, db.Database.Name)
	userStore := persistence.NewUserStore(*db.Database.Session, db.Database.Name)

	user := domain.UserRegistrationRequest{Username: "user", Password: "pass", Name: "name", Email: "email", Age: 10}

	registeredUser, err := userStore.RegisterUser(user)
	if err != nil {
		t.Error(err.Error())
	}

	expires, _ := time.Parse("Jan 2, 2006 at 3:04pm (MST)", "Feb 3, 2013 at 7:54pm (EET)")
	_, err = sessionStore.StartSession(*registeredUser, expires)
	if err != nil {
		t.Error(err.Error())
	}

	_, err = userStore.Authenticate(domain.UserLoginRequest{Username: "user", Password: "pass"})
	if err == nil {
		t.Error("expected Authenticate to return error, but it didn't")
	}
}
