// src/modules/auth.js
import '../api/axios';

// Actions

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const REGISTER_USER = 'REGISTER_USER';
const RESET_MESSAGE = 'RESET_MESSAGE';

// Action Creators
export const registerUser = (request) => {
  console.log('REGISTER_USER Action > request:', request);
  return {
    type: REGISTER_USER,
    payload: {
      request: {
        method: 'post',
        url:'/users/signup',
        data: request
      }
    }    
  };    
}

export const serverLogin = (request) => {
  return {
    type: LOGIN,
    payload: {
      request: {
        method: 'post',
        url:'/users/login',
        data: request
      }
    }    
  };    
}

export const logOut = () => {
  return {
    type: LOGOUT,
    payload: {
      request: {
        method: 'post',
        url:'/users/logout'
      }
    }
  };
}

export const resetAuthMessage = () => {
  return {
    type: RESET_MESSAGE,
    payload: {
      message: ''
    }
  }
}

// Reducer
  export default function reducer(state = {}, action) {
  switch(action.type) {
    
    case 'LOGIN_SUCCESS':
      console.log('Auth Reducer > LOGIN_SUCCESS > payload:', action.payload);
      console.log('Loged in!');
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: true,
        message: 'Loggin successful',
        // userID: action.payload.data.userID
      });

    case 'LOGIN_FAIL':
      console.log('Auth Reducer > LOGIN_FAIL > error:', action.error.response.data);
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: false,
        message: action.error.response.data.Code,
      });

    case 'LOGOUT_SUCCESS':
      console.log('Auth Reducer > LOGOUT_SUCCESS > payload:', action.payload);
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: false,
        message: 'Logged out',
      });
    
    case 'LOGOUT_FAIL':
      console.log('Auth Reducer > LOGOUT_FAIL > payload:', action.error.response.data);
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: true,
        message: 'Still Logged in',
      });

    case 'REGISTER_USER_SUCCESS':
      console.log('Auth Reducer > REGISTER_USER_SUCCESS > payload:', action.payload);
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: false,
        message: 'Registration successful',
      });

    case 'REGISTER_USER_FAIL':
      console.log('Auth Reducer > REGISTER_USER_FAIL > error:', action.error.response.data);
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: false,
        message: [action.error.response.data.Field, action.error.response.data.Code].join('_'),
      });
          
    case 'RESET_MESSAGE':
      return Object.assign({}, state, {
        ...state,
        message: ''
      });

    default:
      return state;
  }
}