package domain

import (
	"errors"
	"time"
)

// Provides primitives sufficient for an app with session based security.
type SessionStore interface {
	// FindSessionAvailableAt takes a session ID and a time instant, looks in the persistence,
	// and asserts if the session is valid in the given time. If there is, the session
	// is returned. Returns a bool aswell, which indicates if the session is valid.
	FindSessionAvailableAt(sessionID string, instant time.Time) (*Session, bool)

	// StartSession takes an User duration time and writes a new Session in the persistence after generating it
	// for the given User. It returns the generated Session and an error if any.
	StartSession(user User, userSessionDuration time.Time) (*Session, error)

	// DeleteSession takes a session ID and removes it from the persistence. Returns an error if any.
	DeleteSession(sessionID string) error

	// UpdateSession takes a session ID and time duration to updates its expiration date, in the persistence layer.
	// Returns an error if any.
	UpdateSession(sessionID string, userSessionDuration time.Time) error
}

// Provides primitives for an app which works with users.
type UserStore interface {
	// RegisterUser takes a UserRegistrationRequest and generates a new User with profile matching the
	// one from the request. Type User has field Hash instead of Password so RegisterUser needs to use
	// some hashing/encrypting algorithm. Then it saves the user in the persistence.
	// Returns the saved User and 3 types of error:
	// 1: if the Username is already taken
	// 2: if the Email is already taken
	// 3: generic unexpected error
	RegisterUser(request UserRegistrationRequest) (*User, error)

	// Authenticate takes an UserLoginRequest and checks if the Username from the request figures in the
	// persistence. If it does it takes the corresponding password hash and checks if it is a valid hash
	// for the password coming from the request. Also it prevents multiple User login by checking if the
	// User already figures in the Session layer of the persistence. Returns 4 types of error:
	// 1: Username does not exist
	// 2: User is already logged in
	// 3: wrong Password
	// 4: generic unexpected error
	Authenticate(request UserLoginRequest) (*User, error)
}

// Provides primitives sufficient for an app in which a User can have multiple Accounts under his name.
type AccountStore interface {
	// InsertAccount takes a new user account coming from the request and inserts it in the persistence.
	// If the account is inserted successfully it returns it's AccountID. It also inserts history in the
	// persistence that states the account was created, the initial sum, the time, the UserID and AccountID.
	// Returns 2 types of errors:
	// 1: if an account with the same currency for THIS User already figures in the persistence
	// 2: generic unexpected error
	InsertAccount(UserID string, account Account) (string, error)

	// GetAccounts takes an UserID and returns all of the Accounts (if any) figuring in the persistence that
	// match the UserID. Returns an error if any.
	GetAccounts(userID string) ([]*Account, error)

	// Deposit takes an Account and deposits the incoming money amount from the request to the corresponding
	// Account in the persistence. Contains the deposit logic. It also inserts history in the persistence that
	// states a deposit was made, the deposited sum, the time, the UserID and AccountID.
	// Returns an error if any.
	Deposit(account Account) (*Account, error)

	// Withdraw takes an Account and withdraws the incoming money amount from the request from the corresponding
	// Account. Contains the withdrawal logic. It also inserts history in the persistence that states a withdraw
	// was made, the withdrawn sum, the time, the UserID and AccountID.
	// Returns 2 types of errors:
	// 1: if the requested amount is greater than the available in the Account
	// 2: generic unexpected error
	Withdraw(account Account) (*Account, error)

	// DeleteAccount takes UserID and AccountID. It deletes the corresponding account from the persistence.
	// Returns error if any.
	DeleteAccount(userID string, accountID string) error

	// GetHistory takes AccountID and UserID. It uses the AccountID to take all of the corresponding history records
	// for this account from the history layer of the persistence. For authorization purposes it uses the UserID to
	// check if all of the records's UserID field equals to the UserID that requested the history. Returns history
	// records and 2 types of errors:
	// 1: if the User requested the History is not authorized to see it
	// 2: generic unexpected error
	GetHistory(historyRequest History) (*[]History, error)
}

type Session struct {
	SessionID string    `bson:"sessionid"`
	UserID    string    `bson:"userid"`
	Expires   time.Time `bson:"expires"`
}

type UserRegistrationRequest struct {
	Username string
	Password string
	Name     string
	Email    string
	Age      int
}

type UserLoginRequest struct {
	Username string
	Password string
}

type ResponseUser struct {
	UserID      string
	Username    string
	Name        string
	Email       string
	Age         int
	DateCreated time.Time
}

type User struct {
	UserID   string `bson:"userid"`
	Username string `bson:"username"`
	Name     string `bson:"name"`
	Email    string `bson:"email"`
	Age      int    `bson:"age"`
	Hash     []byte `bson:"hash"`
}

type Account struct {
	AccountID string  `bson:"accountid"`
	UserID    string  `bson:"userid"`
	Currency  string  `bson:"currency"`
	Amount    float64 `bson:"amount"`
	Type      string  `bson:"type"`
}

type History struct {
	AccountID       string    `bson:"accountid"`
	UserID          string    `bson:"userid"`
	TransactionType string    `bson:"transactiontype"`
	Currency        string    `bson:"currency"`
	Amount          float64   `bson:"amount"`
	Date            time.Time `bson:"date"`
}

type ErrorResponse struct {
	Message string
	ResourceError
}

type ResourceError struct {
	Resource string
	Field    string
	Code     string
}

func NewErrorResponse(message string, resource string, field string, code string) ErrorResponse {
	return ErrorResponse{
		Message: message,
		ResourceError: ResourceError{
			Resource: resource,
			Field:    field,
			Code:     code,
		},
	}
}

var (
	ErrUserAlreadyExists    = errors.New("domain: user already exists")
	ErrEmailAlreadyExists   = errors.New("domain: email already exists")
	ErrUsernameDoesntExist  = errors.New("domain: username does not exist")
	ErrWrongPassword        = errors.New("domain: wrong password")
	ErrAlreadyLoggedIn      = errors.New("domain: user already logged in")
	ErrWithdrawMoreThanHave = errors.New("domain: cannot withdraw more than have")
	ErrUnauthorized         = errors.New("domain: not authorized to see this account history")
)
