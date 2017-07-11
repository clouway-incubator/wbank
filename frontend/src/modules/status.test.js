// Status Reducer

import reducer from './status'

describe('status reducer', () => {
    it('should attach a message to state', () => {
        const state = {}

        expect(reducer(state, action('SHOW_STATUS_MESSAGE', 'Some test message.')))
            .toEqual({ message: 'Some test message.' })
    })

    it('should reset the state status message', () => {
        const state = { message: 'Some test message.' }

        expect(reducer(state, action('RESET_STATUS_MESSAGE')))
            .toEqual({ message: '' })
    })

    it('should attach a message to state after successful account creation', () => {
        const state = {}

        expect(reducer(state, action('CREATE_ACCOUNT_SUCCESS')))
            .toEqual({ message: 'Account created' })
    })

    it('should attach a message to state after successful account deletion', () => {
        const state = {}

        expect(reducer(state, action('DELETE_ACCOUNT_SUCCESS')))
            .toEqual({ message: 'Account deleted' })
    })

    it('should attach a message to state after successful deposit', () => {
        const state = {}

        expect(reducer(state, action('DEPOSIT_ACCOUNT_SUCCESS')))
            .toEqual({ message: 'Deposit successful' })
    })

    it('should attach a message to state after successful withdrawal', () => {
        const state = {}

        expect(reducer(state, action('WITHDRAW_ACCOUNT_SUCCESS')))
            .toEqual({ message: 'Withdrawal successful' })
    })

    const action = (name, data) => {
        return { type: name, payload: { data: data } }
    }
    
})