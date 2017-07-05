
if (process.env.NODE_ENV === 'development') {
    let axios = require('axios')
    let MockAdapter = require('axios-mock-adapter')
    let mock = new MockAdapter(axios);
    let _ = require('lodash');
    let moment = require('moment');

    let accounts = [
            {
            id: 1,
            iban: 'US12345678900987654321',
            currency: 'USD',
            balance: 1024
        },
        {
            id: 2,
            iban: 'BG33245678901234567890',
            currency: 'BGN',
            balance: 2234
        },
        {
            id: 3,
            iban: 'GB32456744301234567890',
            currency: 'GBP',
            balance: 1234
        }
    ];

    let operationsHistory = [
        {
            id: 1,
            iban: 'US12345678900987654321',
            transactionId: 1,
            amount: 1000,
            balance: 1500,
            action: 'deposit',
            date: moment(new Date())
        },
        {
            id: 2,
            iban: 'BG33245678901234567890',
            transactionId: 2,
            amount: 476,
            balance: 1024,
            action: 'withdraw',
            date: moment(new Date())
        },
        {
            id: 3,
            iban: 'GB32456744301234567890',
            transactionId: 3,
            amount: 1000,
            balance: 1500,
            action: 'deposit',
            date: moment(new Date())
        },
        {
            id: 1,
            iban: 'US12345678900987654321',
            transactionId: 4,
            amount: 476,
            balance: 1024,
            action: 'withdraw',
            date: moment(new Date())
        },
        {
            id: 1,
            iban: 'US12345678900987654321',
            transactionId: 5,
            amount: 476,
            balance: 1024,
            action: 'withdraw',
            date: moment(new Date())
        },
        {
            id: 2,
            iban: 'BG33245678901234567890',
            amount: 1000,
            transactionId: 6,
            balance: 1500,
            action: 'deposit',
            date: moment(new Date())
        }
    ];

    let users = [
        {
            username: 'test',
            password: 'test',
            name: 'Karabas Barabas',
            email: 'test@test.com',
            age: 22,
            userId: 'karabas1234567890',
            dateCreated: moment(new Date())
        }
    ];

    //===================================== LEGEND ==================================//
    // CRUD - create, retrieve, update, delete
    // GET /v1/accounts -> Get resource accounts
    // POST /v1/accounts -> Create new account 
    // PUT /v1/accounts/1 {id: 1, iban: "US12345678900987654333", currency: 'USD', amount: 1024} -> Update existing account
    // PATCH /v1/accounts/1 {iban: "USNEW_IBAN_NUMBER"} -> Update existing account
    // DELETE /v1/accounts/1 -> deletes account with id 1
    //===============================================================================//

    //================================REGISTER USER =================================//
    mock.onPost('/users/signup').reply((config) => {
        const accountData = JSON.parse(config.data);
        let userCheck = ifDataAlreadyExist(accountData);
        // console.log('Axios > userCheck', userCheck);

        switch(userCheck) {

          case 'username_already_exist':
            return [400, {
                message: "SignUp Failed",
                resource: "user", 
                field: "username", 
                code: "already_exist"
            }];

          case 'email_already_exist':
            return [400, {
                message: "SignUp Failed", 
                resource: "user", 
                field: "email", 
                code: "already_exist"
            }];
              
          case 'ok': 
            let newUser = {
              username: accountData.username,
              password: accountData.password,
              name: accountData.name,
              email: accountData.email,
              age: accountData.age,
              userId: accountData.username.concat(Math.random().toString().slice(2, 12)),
              dateCreated: moment(new Date())
            }
            users.push(newUser);
            return [201, newUser];

          default:
            return [500, {
                message: "SignUp Failed", 
                resource: "error", 
                field: "unexpected_error", 
                code: "unexpected_server_error"
            }];
        }
    });

    function ifDataAlreadyExist(accountData) {
        let result = 'ok';
        users.forEach(function (user) {
            if (user.username === accountData.username) {
                console.log('Axios > ifDataAlreadyExist > Username already exists!', user.username);
                result = 'username_already_exist';
            }
            if (user.email === accountData.email) {
                console.log('Axios > ifDataAlreadyExist > Email already exists!', user.email);
                result = 'email_already_exist';
            }
        });
        return result;
    }
    //================================== USER LOGIN =================================//
    mock.onPost('/users/login').reply((config) => {
        const accountData = JSON.parse(config.data);
        let authCheck = checkUserAndPassword(accountData);
        // console.log('Axios > authCheck:', authCheck);

        switch(authCheck) {

          case 'auth_ok':
            return [200, {
                sessionID: 'SessionID-string',
                userID: accountData.username,
                expires: 'Expires-time'
            }];

          case 'username_does_not_exist':
            return [404, {
                message: "Login Failed",
                resource: "user", 
                field: "username", 
                code: "username_does_not_exist"
            }];

          case 'wrong_password':
            return [401, {
                message: "Login Failed",
                resource: "user", 
                field: "unexpected_error", 
                code: "wrong_password"
            }];

          case 'already_logged_in':
            return [400, {
              message: "Login Failed",
              resource: "user", 
              field: "user_status",
              code: "already_logged_in"
              }]

          default: 
            return [500, {
                message: "Login Failed",
                resource: "error", 
                field: "password", 
                code: "unexpected_server_error"
            }];
        }
    });

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
        console.log('checkUserAndPassword =>', result );
        return result;
    }

    //=================================== ON MOUNT ==================================//
    mock.onGet('/users/me/accounts').reply(200, accounts.slice());

    //=================================== CREATE ====================================//
    mock.onPost('/users/me/new-account').reply(function (config) {
        let configData = JSON.parse(config.data);

        let highestCurrentId;
        accounts.length ? highestCurrentId = _.maxBy(accounts, function (o) { return o.id; }).id : highestCurrentId = 0;
        
        let newIban = configData.currency.slice(0, 2).concat(Math.random().toString().slice(2,12)).concat(Math.random().toString().slice(2,12));

        let newAccount = {
            id: highestCurrentId + 1,
            iban: newIban,
            currency: configData.currency,
            balance: Number(configData.amount),
            type: configData.type
        };
        accounts.push(newAccount);
        return [201, newAccount];
    });
    
    //================================== DELETE ====================================//
    // mock.onDelete(/\/accounts\/\d+/g).reply(function (config) {
        // const parts = config.url.split("/");
        // const accountId = Number(parts[parts.length-1]);
    mock.onDelete(/\/users\/me\/delete-account\?id=\d+/g).reply(function (config) {
        const parts = config.url.split("=");
        const accountId = Number(parts[1]);
        console.log('AXIOS > mock.onDelete:', accountId);
        let removeIndex = accounts.map(function (o) { return o.id; }).indexOf(accountId);
        console.log('AXIOS > removeIndex:', removeIndex);
        // if (removeIndex === -1) {
        //     return [404];
        // }
        accounts.splice(removeIndex, 1);
        return [204, removeIndex];
    });
    

    //=================================== HISTORY ===================================//
    mock.onGet(/\/operationsHistory\/\d+/g).reply((config) => {
        const parts = config.url.split("/");
        const accountId = Number(parts[parts.length-1]);
        let operationsHistoryArray = [];
        operationsHistory.forEach(function (element) {
            if (element.id === accountId) { operationsHistoryArray.push(element) }
        });
        return [200, operationsHistoryArray];
    })
    
    //================================ DEPOSIT =====================================//
    mock.onPost(/\/users\/me\/deposit\/\d+/g).reply((config) => {
        const parts = config.url.split("/");
        const accountId = Number(parts[parts.length-1]);
        console.log('AXIOS > accountId and CONFIGDATA:', accountId, config.data);
        const accountData = JSON.parse(config.data);
        let index = _.findIndex(accounts, function(o) { return o.id === accountId; });
        const account = accounts[index];
        console.log("AXIOS > account.balance before: ", account.balance);
        
        account.balance += accountData;

        let highestCurrentTransactionId;
        operationsHistory.length ? highestCurrentTransactionId = _.maxBy(operationsHistory, function (o) { return o.transactionId; }).transactionId : highestCurrentTransactionId = 0;

        let newDeposit = {
            id: account.id,
            iban: account.iban,
            amount: accountData,
            transactionId: highestCurrentTransactionId + 1,
            balance: account.balance,
            action: 'deposit',
            date: moment(new Date())
        }
        operationsHistory.push(newDeposit);
        return[201, newDeposit];
    });

    //=================================== WITHDRAW ===================================//
    mock.onPost(/\/users\/me\/withdraw\/\d+/g).reply((config) => {
        const parts = config.url.split("/");
        const accountId = Number(parts[parts.length-1]);
        console.log('AXIOS > accountId and CONFIGDATA:', accountId, config.data);
        const accountData = JSON.parse(config.data);
        let index = _.findIndex(accounts, function(o) { return o.id === accountId; });
        const account = accounts[index];
        console.log("AXIOS > account.balance before: ", account.balance);

        if (accountData > account.balance) {
            const errorResponse = {
                message: "User Account Withdraw Failed",
                resource: "account", 
                field: "money_availability", 
                code: "not_enough_available"
            }
            return [400, errorResponse];
        }

        let highestCurrentTransactionId;
        operationsHistory.length ? highestCurrentTransactionId = _.maxBy(operationsHistory, function (o) { return o.transactionId; }).transactionId : highestCurrentTransactionId = 0;

        account.balance -= accountData;

        let newWithdraw = {
            id: account.id,
            iban: account.iban,
            amount: accountData,
            transactionId: highestCurrentTransactionId + 1,
            balance: account.balance,
            action: 'withdraw',
            date: moment(new Date())
        }
        operationsHistory.push(newWithdraw);
        return [201, newWithdraw];
    });
}