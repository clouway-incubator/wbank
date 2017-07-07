// src/modules/history.js
import '../api/axios'

// Actions
const LOAD_ACCOUNT_HISTORY = 'LOAD_ACCOUNT_HISTORY'

// Action Creators
export const loadAccountHistory = (accountId) => {
  return {
    type: LOAD_ACCOUNT_HISTORY,
    payload: {
      request: {
        method: 'post',
        url: '/users/me/account-history',
        data: {
          AccountID: accountId
        }
      }
    }
  }
}

// Reducer
export default function reducer(state = [], action) {
  switch(action.type) {

    case 'LOAD_ACCOUNT_HISTORY_SUCCESS':  
      return action.payload.data

    case 'LOAD_ACCOUNT_HISTORY_FAIL':
      return state

    default:
      return state
  }
}