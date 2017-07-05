// History Reducer
import reducer from './history'

// Tests
test('should attach account history to state after loaded', () => {
    const state = []

    expect(reducer(state, action('LOAD_ACCOUNT_HISTORY_SUCCESS', [{
            AccountID: 'YB1PM',
            TransactionType: 'deposit',
            Currency: 'USD',
            Amount: 1000,
        },
        {
            AccountID: 'YB1PM',
            TransactionType: 'withdraw',
            Currency: 'USD',
            Amount: 2000,
        }])))
        .toEqual(
            [{
                AccountID: 'YB1PM',
                TransactionType: 'deposit',
                Currency: 'USD',
                Amount: 1000,
            },
            {
                AccountID: 'YB1PM',
                TransactionType: 'withdraw',
                Currency: 'USD',
                Amount: 2000,
            }]
        )
})

const action = (name, data) => {
    return {type: name, payload: {data: data}}
}