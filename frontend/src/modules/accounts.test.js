// Accounts Reducer
import reducer from './accounts'

// Tests
test('should attach accounts to state after they are loaded', () => {
    const state = {accounts: [], accountDetails: undefined}

    expect(reducer(state, action('LOAD_ACCOUNTS_SUCCESS', [{AccountID: "1"}, {AccountID: "2"}])))
        .toEqual(                
            {
                accounts: [{AccountID: "1"}, {AccountID: "2"}],
                accountDetails: undefined
            }
        )
})

test('should start loading of account details', () => {
    const state = {accounts: [{AccountID: "1"}, {AccountID: "2"}], accountDetails: undefined}

    expect(reducer(state, action('LOAD_ACCOUNT_DETAILS', {AccountID: "2", Amount: 23})))
        .toEqual(
            {
                accounts: [{AccountID: "1"}, {AccountID: "2"}],
                accountDetails: undefined,
                loading: true
            }
        )
})

test('should load account details', () => {
    const state = {accounts: [{AccountID: "1"}, {AccountID: "2"}], accountDetails: undefined}

    expect(reducer(state, action('LOAD_ACCOUNT_DETAILS_SUCCESS', {AccountID: "2", Amount: 23})))
        .toEqual(
            {
                accounts: [{AccountID: "1"}, {AccountID: "2"}],
                accountDetails: {AccountID: "2", Amount: 23},
                loading: false
            }
        )
})

test('should create new account', () => {
    const state = {accounts: [{AccountID: "1"}, {AccountID: "2"}], accountDetails: undefined}

    expect(reducer(state, action('CREATE_ACCOUNT_SUCCESS', {AccountID: "3"})))
        .toEqual(
            {
                accounts: [{AccountID: "1"}, {AccountID: "2"}, {AccountID: "3"}],
                accountDetails: undefined
            }
        )

})

test('should deposit a given amount into selected account and update both accounts and accountDetails', () => {
    const state = {accounts: [{AccountID: "1", Amount: 100}, {AccountID: "2", Amount: 200}], accountDetails: {AccountID: "1", Amount: 100}}

    expect(reducer(state, action('DEPOSIT_ACCOUNT_SUCCESS', {AccountID: "1", Amount: 150})))
        .toEqual(
            {
                accounts: [{AccountID: "1", Amount: 150}, {AccountID: "2", Amount: 200}],
                accountDetails: {AccountID: "1", Amount: 150}
            }
        )
})

test('should withdraw a given amount from selected account and update both accounts and accountDetails', () => {
    const state = {accounts: [{AccountID: "1", Amount: 100}, {AccountID: "2", Amount: 200}], accountDetails: {AccountID: "2", Amount: 200}}

    expect(reducer(state, action('WITHDRAW_ACCOUNT_SUCCESS', {AccountID: "2", Amount: 0})))
        .toEqual(
            {
                accounts: [{AccountID: "1", Amount: 100}, {AccountID: "2", Amount: 0}],
                accountDetails: {AccountID: "2", Amount: 0}
            }
        )
})

const action = (name, data) => {
    return {type: name, payload: {data: data}}
}