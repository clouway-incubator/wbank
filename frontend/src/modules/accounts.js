// src/modules/accounts.js
import '../api/axios'

// Actions
const LOAD_ACCOUNTS   = 'LOAD_ACCOUNTS'
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

export const createAccount = (newAccount) => {
  console.log('ACTION > createAccount > data:', newAccount)
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

// Reducer
  export default function reducer(state = [], action) {
    let AccountID, Amount, AccountIndex, UpdatedAccount

  switch(action.type) {
    case 'LOAD_ACCOUNTS_SUCCESS':
      //  if (!action.payload.data || action.payload.data === null) {
      //   return []
      // }
      return action.payload.data

    case 'CREATE_ACCOUNT_SUCCESS':
      return [
        ...state, 
        action.payload.data
      ]
    
    case 'CREATE_ACCOUNT_FAIL':
      return state

    case 'DELETE_ACCOUNT_SUCCESS':
      return [
        ...state.slice(0, action.payload.data),
        ...state.slice(action.payload.data + 1)
      ]

    case 'DELETE_ACCOUNT_FAIL':
      return state
    
    case 'DEPOSIT_ACCOUNT_SUCCESS':
      AccountID = action.payload.data.AccountID
      Amount = action.payload.data.Amount
      AccountIndex = state.map(function (o) { return o.AccountID; }).indexOf(AccountID)
      UpdatedAccount = (Object.assign(
        {}, 
        state[AccountIndex], 
        { Amount: Amount }
      ))
      return [
        ...state.slice(0, AccountIndex),
        UpdatedAccount,
        ...state.slice(AccountIndex + 1)
      ]

    case 'DEPOSIT_ACCOUNT_FAIL':
      return state

    case 'WITHDRAW_ACCOUNT_SUCCESS':
      AccountID = action.payload.data.AccountID
      Amount = action.payload.data.Amount
      AccountIndex = state.map(function (o) { return o.AccountID; }).indexOf(AccountID)
      UpdatedAccount = (Object.assign(
        {}, 
        state[AccountIndex], 
        { Amount: Amount }
      ))
      return [
        ...state.slice(0, AccountIndex),
        UpdatedAccount,
        ...state.slice(AccountIndex + 1)
      ]
    
    case 'WITHDRAW_ACCOUNT_FAIL':
      return state
 
    default:
      return state
  }
}