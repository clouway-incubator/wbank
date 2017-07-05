// Status Reducer
import reducer from './status'

// Tests
test('should attach a message to state', () => {
    const state = {}

    expect(reducer(state, action('SHOW_STATUS_MESSAGE', 'Some test message.')))
        .toEqual({message: 'Some test message.'})
})

test('should reset the state status message', () => {
    const state = {message: 'Some test message.'}

    expect(reducer(state, action('RESET_STATUS_MESSAGE')))
        .toEqual({message: ''})
})

test('should attach a message to state after successful account creation', () => {
    const state = {}

    expect(reducer(state, action('CREATE_ACCOUNT_SUCCESS')))
        .toEqual({message: 'Account created'})
})

test('should attach a message to state after successful account deletion', () => {
    const state = {}

    expect(reducer(state, action('DELETE_ACCOUNT_SUCCESS')))
        .toEqual({message: 'Account deleted'})
})

test('should attach a message to state after successful deposit', () => {
    const state = {}

    expect(reducer(state, action('DEPOSIT_ACCOUNT_SUCCESS')))
        .toEqual({message: 'Deposit successful'})
})

test('should attach a message to state after successful withdrawal', () => {
    const state = {}

    expect(reducer(state, action('WITHDRAW_ACCOUNT_SUCCESS')))
        .toEqual({message: 'Withdrawal successful'})
})

const action = (name, data) => {
    return {type: name, payload: {data: data}}
}