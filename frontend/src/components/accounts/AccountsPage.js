import React from 'react';
import AccountList from './AccountList';
import CreateAccount from './CreateAccount';

class AccountsPage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.loadAccounts()
  }

  render() {
    const { accounts, createAccount, showStatusMessage } = this.props
    const accountListCheck = (accounts) => {
      if (accounts.length !== 0) {
        return <AccountList accounts={accounts} />
      } else {
        return <p>You have no accounts. Use the button below to get started!</p>
      }
    } 

    return (
      <div className="jumbotron">
        <h2>Your Accounts</h2>
        {accountListCheck(accounts)}
        <CreateAccount
          accounts={accounts}
          createAccount={createAccount}
          showStatusMessage={showStatusMessage}
        />
      </div>
      )
    }
}

export default AccountsPage;