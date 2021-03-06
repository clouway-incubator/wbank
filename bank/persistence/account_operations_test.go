package persistence_test

import (
	"reflect"
	"testing"

	"github.com/iliyanmotovski/bankv1/bank/domain"
	"github.com/iliyanmotovski/bankv1/bank/persistence"
	"github.com/iliyanmotovski/bankv1/bank/persistence/testdb"
)

func TestItWritesAndReadsAccountData(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	accountStore := persistence.NewAccountStore(*db.Database.Session, db.Database.Name)

	testAccount := &domain.Account{UserID: "1234", Currency: "testC", Amount: 10, Type: "VISA"}

	accountID, err := accountStore.InsertAccount(testAccount.UserID, *testAccount)
	if err != nil {
		t.Error(err.Error())
	}

	testAccount.AccountID = accountID

	accounts, err := accountStore.GetAccounts(testAccount.UserID)
	if err != nil {
		t.Error(err.Error())
	}

	if !reflect.DeepEqual(accounts[0], testAccount) {
		t.Errorf("expected account: %v got: %v", testAccount, accounts[0])
	}
}

func TestWhenThereAreNoAccounts(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	accountStore := persistence.NewAccountStore(*db.Database.Session, db.Database.Name)

	accounts, err := accountStore.GetAccounts("123")
	if err != nil {
		t.Error(err.Error())
	}

	if len(accounts) != 0 {
		t.Errorf("expected zero accounts but got: %v", len(accounts))
	}
}

func TestItUpdatesAndDeletesAccountData(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	accountStore := persistence.NewAccountStore(*db.Database.Session, db.Database.Name)

	testAccount := domain.Account{UserID: "1234", Currency: "testC", Amount: 10, Type: "VISA"}

	accountID, err := accountStore.InsertAccount(testAccount.UserID, testAccount)

	testAccountDeposit := domain.Account{AccountID: accountID, UserID: "1234", Currency: "testC", Amount: 5}
	testAccountWithdraw := domain.Account{AccountID: accountID, UserID: "1234", Currency: "testC", Amount: 2}
	expected := &domain.Account{UserID: "1234", AccountID: accountID, Currency: "testC", Amount: 13, Type: "VISA"}

	_, err = accountStore.Deposit(testAccountDeposit)
	if err != nil {
		t.Error(err.Error())
	}

	_, err = accountStore.Withdraw(testAccountWithdraw)
	if err != nil {
		t.Error(err.Error())
	}

	accounts, err := accountStore.GetAccounts(expected.UserID)
	if err != nil {
		t.Error(err.Error())
	}
	if !reflect.DeepEqual(accounts[0], expected) {
		t.Errorf("expected account: %v got: %v", expected, accounts[0])
	}

	err = accountStore.DeleteAccount("1234", accountID)
	if err != nil {
		t.Error(err.Error())
	}

	a, err := accountStore.GetAccounts(expected.UserID)
	if err != nil {
		t.Error(err.Error())
	}

	if len(a) != 0 {
		t.Error("expected to have 0 accounts in the DB, but there was more")
	}
}

func TestItReadsCorrectHistoryData(t *testing.T) {
	db := testdb.NewDatabase()
	defer db.Close()

	accountStore := persistence.NewAccountStore(*db.Database.Session, db.Database.Name)

	expected := domain.History{AccountID: "12345", UserID: "54321", TransactionType: "testT", Currency: "testC", Amount: 10}

	err := db.Database.C("history").Insert(&domain.History{AccountID: expected.AccountID, UserID: expected.UserID, TransactionType: expected.TransactionType, Currency: expected.Currency, Amount: expected.Amount})
	if err != nil {
		t.Error(err.Error())
	}

	h, err := accountStore.GetHistory(expected)
	if err != nil {
		t.Error(err.Error())
	}

	history := *h

	if history[0] != expected {
		t.Errorf("expected history: %v got: %v", expected, history[0])
	}
}
