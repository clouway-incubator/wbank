// src/modules/auth.js
import '../api/axios'

// Actions

const LOGIN = 'LOGIN'
const LOGGED_IN = 'LOGGED_IN'
const LOGOUT = 'LOGOUT'
const REGISTER_USER = 'REGISTER_USER'
const RESET_AUTH_MESSAGE = 'RESET_AUTH_MESSAGE'

// Action Creators
export const registerUser = (request) => {
  return {
    type: REGISTER_USER,
    payload: {
      request: {
        method: 'post',
        url:'/users/signup',
        data: request
      }
    }    
  }
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
  }  
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
  }
}

export const loggedIn = () => {
  return {
    type: LOGGED_IN
  }
}

export const resetAuthMessage = () => {
  return {
    type: RESET_AUTH_MESSAGE,
    payload: {
      message: ''
    }
  }
}

// Reducer
  export default function reducer(state = {}, action) {
  switch(action.type) {
    
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: true,
        message: 'Loggin successful',
      })

    case 'LOGIN_FAIL':
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: false,
        message: action.error.response.data.Code,
      })

    case 'LOGOUT_SUCCESS':
      document.cookie = "SID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: false,
        message: 'Logged out',
      })
    
    case 'LOGOUT_FAIL':
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: false,
        message: 'Already logged out',
      })

    case 'REGISTER_USER_SUCCESS':
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: false,
        message: 'Registration successful',
      })

    case 'REGISTER_USER_FAIL':
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: false,
        message: [action.error.response.data.Field, action.error.response.data.Code].join('_'),
      })

    case 'LOGGED_IN':
      return Object.assign({}, state, {
        ...state,
        isLoggedIn: true,
        message: 'Already logged in'
      })
          
    case 'RESET_AUTH_MESSAGE':
      return Object.assign({}, state, {
        ...state,
        message: ''
      })

    default:
      return state
  }
}