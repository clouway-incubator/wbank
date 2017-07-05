// src/modules/history.js
import '../api/axios';

// Actions
const LOAD_HISTORY = 'LOAD_HISTORY';

// Action Creators
export const loadHistory = (accountId) => {
  console.log('Action Creator LOAD_HISTORY for AccountID', accountId);
  return {
    type: LOAD_HISTORY,
    payload: {
      request: {
        method: 'post',
        url: '/users/me/account-history',
        data: {
          AccountID: accountId
        }
      }
    }
  };
};

// Reducer
export default function reducer(state = [], action) {
  switch(action.type) {

    case 'LOAD_HISTORY_SUCCESS':
      console.log('Reducer > LOAD_HISTORY_SUCCESS > data:', action.payload.data);
      return action.payload.data;

    case 'LOAD_HISTORY_FAIL':
      console.log('Reducer > LOAD_HISTORY_FAIL > error:', action.error);
      return state;

    default:
      return state;
  }
}