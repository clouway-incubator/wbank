// src/modules/accounts.js
import '../api/axios'

// Actions
const LOAD_ACCOUNTS   = 'LOAD_ACCOUNTS'
const LOAD_ACCOUNT_DETAILS = 'LOAD_ACCOUNT_DETAILS'
const CREATE_ACCOUNT = 'CREATE_ACCOUNT'
const DELETE_ACCOUNT = 'DELETE_ACCOUNT'
const DEPOSIT_ACCOUNT = 'DEPOSIT_ACCOUNT'
const WITHDRAW_ACCOUNT = 'WITHDRAW_ACCOUNT'

// Action Creators
export const loadAccounts = () => {
  return {
    type: LOAD_ACCOUNTS,
    payload: {
      request: {
        method: 'get',
        url:'/users/me/accounts'
      }
    }
  }
}

export const loadAccountDetails = (accountId) => {
  return {
    type: LOAD_ACCOUNT_DETAILS,
    payload: {
      request: {
        method: 'get',
        url:'/users/me/accounts/' + accountId
      }
    }
  }
}

export const createAccount = (newAccount) => {
  return {
    type: CREATE_ACCOUNT,
    payload: {
      request: {
        method: 'post',
        url:'/users/me/new-account',
        data: newAccount
      }
    }
  }
}

export const deleteAccount = (accountId) => {
  return {
    type: DELETE_ACCOUNT,
    payload: {
      request: {
        method: 'delete',
        url: '/users/me/delete-account?id=' + accountId
      }
    }
  }
}

export const depositAccount = (accountId, amount) => {
  return {
    type: DEPOSIT_ACCOUNT,
      payload: {
        request: {
          method: 'post',
          url: '/users/me/deposit',
          data: {
            AccountID: accountId,
            Amount: amount
          }
      }
    }
  }
}

export const withdrawAccount = (accountId, amount) => {
  return {
    type: WITHDRAW_ACCOUNT,
      payload: {
      request: {
        method: 'post',
        url: '/users/me/withdraw',
        data: {
          AccountID: accountId,
          Amount: amount
        }
      }
    }
  }
}

export default function reducer(state = {
  accounts: [], 
  accountDetails: undefined
}, action) {

  let accounts, AccountID, Amount, AccountIndex, UpdatedAccount

  switch (action.type) {
    case 'LOAD_ACCOUNTS_SUCCESS':
      return Object.assign({}, state, {
        accounts: action.payload.data
      })

    case 'LOAD_ACCOUNT_DETAILS_SUCCESS':
      return Object.assign({}, state, {
        accountDetails: action.payload.data
      })

    case 'CREATE_ACCOUNT_SUCCESS':
      accounts = [...state.accounts]
      accounts.push(action.payload.data)
      return Object.assign({}, state, {
        accounts: accounts
      })


    case 'DELETE_ACCOUNT_SUCCESS':
      return state
    
    case 'DEPOSIT_ACCOUNT_SUCCESS':
      accounts = [...state.accounts]
      AccountID = action.payload.data.AccountID
      Amount = action.payload.data.Amount
      AccountIndex = accounts.map(function (o) { return o.AccountID; }).indexOf(AccountID)
      UpdatedAccount = (Object.assign({}, accounts[AccountIndex], { Amount: Amount }))
      accounts = accounts.slice(0, AccountIndex).concat(UpdatedAccount).concat(accounts.slice(AccountIndex + 1))
      return Object.assign({}, state, {
        accountDetails: action.payload.data,
        accounts: accounts,
      })

    case 'WITHDRAW_ACCOUNT_SUCCESS':
      accounts = [...state.accounts]
      AccountID = action.payload.data.AccountID
      Amount = action.payload.data.Amount
      AccountIndex = accounts.map(function (o) { return o.AccountID; }).indexOf(AccountID)
      UpdatedAccount = (Object.assign({}, accounts[AccountIndex], { Amount: Amount }))
      accounts = accounts.slice(0, AccountIndex).concat(UpdatedAccount).concat(accounts.slice(AccountIndex + 1))
      return Object.assign({}, state, {
        accountDetails: action.payload.data,
        accounts: accounts,
      })

    default:
      return state
  }
}