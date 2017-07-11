// Auth Reducer

import reducer from './auth'

describe('auth reducer', () => {
    it('should change isLoggedIn boolean to false and attach a message to state', () => {
        const state = { isLoggedIn: false }

        expect(reducer(state, action('REGISTER_USER_SUCCESS')))
            .toEqual({ isLoggedIn: false, message: 'Registration successful' })
    })

    it('should change isLoggedIn boolean to true and attach a message to state', () => {
        const state = { isLoggedIn: false }

        expect(reducer(state, action('LOGIN_SUCCESS')))
            .toEqual({ isLoggedIn: true, message: 'Loggin successful' })
    })

    it('should change isLoggedIn boolean to false and attach a message to state', () => {
        const state = { isLoggedIn: true }

        expect(reducer(state, action('LOGOUT_SUCCESS')))
            .toEqual({ isLoggedIn: false, message: 'Logged out' })
    })

    it('should keep isLoggedIn boolean true and attach a message to state', () => {
        const state = {}

        expect(reducer(state, action('LOGOUT_FAIL')))
            .toEqual({ isLoggedIn: false, message: 'Already logged out' })
    })

    it('should keep isLoggedIn boolean true and attach a message to state', () => {
        const state = {}

        expect(reducer(state, action('LOGGED_IN')))
            .toEqual({ isLoggedIn: true, message: 'Already logged in' })
    })

    it('should reset the state auth message', () => {
        const state = { message: 'Already logged in' }

        expect(reducer(state, action('RESET_AUTH_MESSAGE')))
            .toEqual({ message: '' })
    })

    const action = (name, data) => {
        return { type: name, payload: { data: data } }
    }
    
})