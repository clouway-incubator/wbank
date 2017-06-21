package testdb

import (
	"fmt"
	"gopkg.in/mgo.v2"
	"os"
	"strconv"
	"time"
)

const (
	name = "testDb"
)

type DB struct {
	Database *mgo.Database
}

func NewDatabase() *DB {
	host := os.Getenv("TEST_DB_HOST")
	if host == "" {
		host = "localhost:27017"
	}

	return NewDatabaseWithHost(host)
}

func NewDatabaseWithHost(host string) *DB {
	t := time.Now().Nanosecond()
	dbName := name + strconv.Itoa(t)

	sess, err := connect(host)
	if err != nil {
		panic(fmt.Errorf("could not establish connection: %v", err))
	}
	sess.SetMode(mgo.Strong, true)
	database := sess.DB(dbName)

	return &DB{Database: database}
}

func (db *DB) Close() {
	db.Clean()
	db.Database.DropDatabase()
	db.Database.Session.Close()
}

func (db *DB) Clean() {
	cnames, _ := db.Database.CollectionNames()

	for _, cname := range cnames {
		db.Database.C(cname).RemoveAll(nil)
	}
}

func connect(host string) (*mgo.Session, error) {
	sess, err := mgo.Dial(host)

	if err != nil {
		return nil, err
	}

	return sess, nil
}
