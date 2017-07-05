// src/modules/status.js

// Actions
const SHOW_STATUS_MESSAGE = 'SHOW_STATUS_MESSAGE';
const RESET_STATUS_MESSAGE = 'RESET_STATUS_MESSAGE';

export const showStatusMessage = (statusMessage) => {
  return {
    type: SHOW_STATUS_MESSAGE,
    payload: statusMessage
  };
}

export const resetStatusMessage = () => {
  return {
    type: RESET_STATUS_MESSAGE
  }
}

// Reducer
  export default function reducer(state = {}, action) {
  switch(action.type) {

    case 'SHOW_STATUS_MESSAGE':
      return Object.assign({}, state, {
        ...state,
        message: action.payload
      });

    case 'RESET_STATUS_MESSAGE':
      return Object.assign({}, state, {
        ...state,
        message: ''
      });

    case 'CREATE_ACCOUNT_SUCCESS':
      return Object.assign({}, state, {
        ...state,
        message: `Account created`
      });

    case 'CREATE_ACCOUNT_FAIL':
      return Object.assign({}, state, {
        ...state,
        message: action.error.response.data.Message
      });

    case 'DELETE_ACCOUNT_SUCCESS':
      return Object.assign({}, state, {
        ...state,
        message: `Account deleted`
      });

    case 'DELETE_ACCOUNT_FAIL':
      return Object.assign({}, state, {
        ...state,
        message: action.error.response.data.Message + ': ' + action.error.response.data.Code
      });

    case 'DEPOSIT_ACCOUNT_SUCCESS':
      return Object.assign({}, state, {
        ...state,
        message: `Successful deposit into ${action.payload.data.AccountID}`
      });

    case 'DEPOSIT_ACCOUNT_FAIL':
      return Object.assign({}, state, {
        ...state,
        message: action.error.response.data.Message + ': ' + action.error.response.data.Code
      });
    
    case 'WITHDRAW_ACCOUNT_SUCCESS':
      return Object.assign({}, state, {
        ...state,
        message: `Successful withdrawal from ${action.payload.data.AccountID}`
      });

    case 'WITHDRAW_ACCOUNT_FAIL':
      return Object.assign({}, state, {
        ...state,
        message: action.error.response.data.Message + ': ' + action.error.response.data.Code
      });

    default:
      return state;
  }
}