// Auth Reducer
import reducer from './auth'

// Tests
test('should change isLoggedIn boolean to false and attach a message to state', () => {
    const state = {isLoggedIn: false}

    expect(reducer(state, action('REGISTER_USER_SUCCESS')))
        .toEqual({isLoggedIn: false, message: 'Registration successful'})
})

test('should change isLoggedIn boolean to true and attach a message to state', () => {
    const state = {isLoggedIn: false}

    expect(reducer(state, action('LOGIN_SUCCESS')))
        .toEqual({isLoggedIn: true, message: 'Loggin successful'})
})

test('should change isLoggedIn boolean to false and attach a message to state', () => {
    const state = {isLoggedIn: true}

    expect(reducer(state, action('LOGOUT_SUCCESS')))
        .toEqual({isLoggedIn: false, message: 'Logged out'})
})

test('should keep isLoggedIn boolean true and attach a message to state', () => {
    const state = {}

    expect(reducer(state, action('LOGOUT_FAIL')))
        .toEqual({isLoggedIn: false, message: 'Already logged out'})
})

test('should keep isLoggedIn boolean true and attach a message to state', () => {
    const state = {}

    expect(reducer(state, action('LOGGED_IN')))
        .toEqual({isLoggedIn: true, message: 'Already logged in'})
})

test('should reset the state auth message', () => {
    const state = {message: 'Already logged in'}

    expect(reducer(state, action('RESET_AUTH_MESSAGE')))
        .toEqual({message: ''})
})

const action = (name, data) => {
    return {type: name, payload: {data: data}}
}