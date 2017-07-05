if (process.env.NODE_ENV === 'development') {
    let axios = require('axios')
    let MockAdapter = require('axios-mock-adapter')
    let mock = new MockAdapter(axios)
    let _ = require('lodash')
    let moment = require('moment')

    let accounts = [
            {
            AccountID: 'YB1PM',
            Currency: 'USD',
            Amount: 1024,
            Type: 'Credit'
        },
    ]

    let operationsHistory = [
        {
            AccountID: 'YB1PM',
            TransactionType: 'deposit',
            Currency: 'USD',
            Amount: 1000,
            Date: moment(new Date())
        },
        {
            AccountID: 'YB1PM',
            TransactionType: 'withdraw',
            Currency: 'USD',
            Amount: 2000,
            Date: moment(new Date())
        },        
        {
            AccountID: 'YB1PM',
            TransactionType: 'deposit',
            Currency: 'USD',
            Amount: 3000,
            Date: moment(new Date())
        },
        {
            AccountID: 'YB1PM',
            TransactionType: 'withdraw',
            Currency: 'USD',
            Amount: 4000,
            Date: moment(new Date())
        },
    ]

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
    ]

    mock.onPost('/users/signup').reply((config) => {
        const accountData = JSON.parse(config.data)
        let userCheck = ifDataAlreadyExist(accountData)

        switch(userCheck) {

          case 'username_already_exist':
            return [400, {
                message: "SignUp Failed",
                resource: "user", 
                field: "username", 
                code: "already_exist"
            }]

          case 'email_already_exist':
            return [400, {
                message: "SignUp Failed", 
                resource: "user", 
                field: "email", 
                code: "already_exist"
            }]
              
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
            users.push(newUser)
            return [201, newUser]

          default:
            return [500, {
                message: "SignUp Failed", 
                resource: "error", 
                field: "unexpected_error", 
                code: "unexpected_server_error"
            }]
        }
    })

    function ifDataAlreadyExist(accountData) {
        let result = 'ok'
        users.forEach(function (user) {
            if (user.username === accountData.username) {
                result = 'username_already_exist'
            }
            if (user.email === accountData.email) {
                result = 'email_already_exist'
            }
        })
        return result
    }

    mock.onPost('/users/login').reply((config) => {
        const request = JSON.parse(config.data)
        let authCheck = checkUserAndPassword(request)

        switch(authCheck) {

          case 'auth_ok':
            return [200, {
                sessionID: 'SessionID-string',
                userID: request.username,
                expires: 'Expires-time'
            }]

          case 'username_does_not_exist':
            return [404, {
                message: "Login Failed",
                resource: "user", 
                field: "username", 
                code: "username_does_not_exist"
            }]

          case 'wrong_password':
            return [401, {
                message: "Login Failed",
                resource: "user", 
                field: "unexpected_error", 
                code: "wrong_password"
            }]

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
            }]
        }
    })

    function checkUserAndPassword(request) {
        let result = 'username_does_not_exists'
        const found = users.find(user => user.username === request.username)
        if (found) {
            if (found.password === request.password) {
                result = 'auth_ok'
            } else {
                result = 'wrong_password'
            }
        }
        return result
    }

    mock.onGet(/\/users\/me\/accounts\/\w+/g).reply(function (config) {
        const urlParts = config.url.split("/")
        const accountId = urlParts[urlParts.length-1]
        let accountDetails
        accounts.forEach(function (element) {
            if (element.AccountID === accountId) { 
                accountDetails = element
            }
        })
        return [200, accountDetails]
    })

    mock.onGet('/users/me/accounts').reply(200, accounts.slice())

    mock.onPost('/users/me/new-account').reply(function (config) {
        let configData = JSON.parse(config.data)
        let newAccount = {
            AccountID: makeid(),
            Currency: configData.Currency,
            Amount: parseFloat(configData.Amount),
            Type: configData.Type
        };
        accounts.push(newAccount)
        return [201, newAccount]
    })
    
    mock.onDelete(/\/users\/me\/delete-account\?id=\w+/g).reply(204)
    
    mock.onPost('/users/me/account-history').reply((config) => {
        const accountId = JSON.parse(config.data).AccountID
        const operationsHistoryArray = operationsHistory.filter(item => item.AccountID === accountId)
        return [200, operationsHistoryArray]
    })
    
    mock.onPost('/users/me/deposit').reply((config) => {
        const configData = JSON.parse(config.data)      
        let index = _.findIndex(accounts, function(o) { return o.AccountID === configData.AccountID; })
        const account = accounts[index]
        let newDeposit = {
            AccountID: configData.AccountID,
            Currency: account.Currency,
            Amount: account.Amount + configData.Amount,
            TransactionType: 'deposit',
            Date: moment(new Date())
        }
        operationsHistory.push(newDeposit);
        return[201, newDeposit]
    })

    mock.onPost('/users/me/withdraw').reply((config) => {
        const configData = JSON.parse(config.data)      
        let index = _.findIndex(accounts, function(o) { return o.AccountID === configData.AccountID; })
        const account = accounts[index]
        
        if (configData.Amount > account.Amount) {
            const errorResponse = {
                message: "User Account Withdraw Failed",
                resource: "account", 
                field: "money_availability", 
                code: "not_enough_available"
            }
            return [400, errorResponse]
        }

        let newWithdraw = {
            AccountID: configData.AccountID,
            Currency: account.Currency,
            Amount: account.Amount - configData.Amount,
            TransactionType: 'withdraw',
            Date: moment(new Date())
        }
        operationsHistory.push(newWithdraw)
        return [201, newWithdraw]
    })

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}