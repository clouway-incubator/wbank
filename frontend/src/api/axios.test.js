let expect = require('expect');
let moment = require('moment');

let users = [
  {
    username: 'karabas',
    password: 'barabas',
    name: 'Karabas Barabas',
    email: 'root@nasa.gov',
    age: 22,
    userId: 'karabas1234567890',
    dateCreated: moment(new Date())
  }, {
    username: 'barabas',
    password: 'barabas',
    name: 'Karabas Barabas',
    email: 'root@nasa.com',
    age: 22,
    userId: 'karabas1234567890',
    dateCreated: moment(new Date())
  },
];

function checkUserAndPassword(accountData) {
  let result = 'username_does_not_exist';
  users.forEach(function (user) {
    if (user.username === accountData.username) {
      if (user.password === accountData.password) {
        result = 'auth_ok';
        return result;
      } else {
        result = 'wrong_password';
        return result;
      }
    } 
  });
  return result;
}

function ifDataAlreadyExist(accountData) {
  let result = 'ok';
  users.forEach(function (user) {
    if (user.username === accountData.username) {
      result = 'username_already_exist';
    }
    if (user.email === accountData.email) {
      result = 'email_already_exist';
    }
  });
  return result;
}

// TEST checkUserAndPassword 1
expect(
  checkUserAndPassword({username: 'fdsfsd', password: 'barabas'})
).toEqual('username_does_not_exist');

// TEST checkUserAndPassword 2
expect(
  checkUserAndPassword({username: 'barabas', password: 'fdsfsd'})
).toEqual('wrong_password');

// // TEST checkUserAndPassword 3
expect(
  checkUserAndPassword({username: 'karabas', password: 'barabas'})
).toEqual('auth_ok');

// // TEST checkUserAndPassword 4
expect(
  checkUserAndPassword({username: 'barabas', password: 'barabas'})
).toEqual('auth_ok');

// TEST ifDataAlreadyExist 1
expect(
  ifDataAlreadyExist({username: 'karabas', password: 'barabas', email: 'joe@gmail.com'})
).toEqual('username_already_exist');

// TEST ifDataAlreadyExist 2
expect(
  ifDataAlreadyExist({username: 'tarabas', password: 'barabas', email: 'root@nasa.gov'})
).toEqual('email_already_exist');

// TEST ifDataAlreadyExist 3
expect(
  ifDataAlreadyExist({username: 'tarabas', password: 'barabas', email: 'joe@gmail.com'})
).toEqual('ok');

console.log('All tests passed');
