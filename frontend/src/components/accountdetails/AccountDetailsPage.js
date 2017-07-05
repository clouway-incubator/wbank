import React from 'react';
import {Link} from 'react-router-dom';
import AccountDetailsTable from './AccountDetailsTable';

export default class AccountDetailsPage extends React.Component {
  constructor(props){
    super(props);

    this.onClickDeleteAccount = this.onClickDeleteAccount.bind(this);
    this.onDepositClick = this.onDepositClick.bind(this);
    this.onWithdrawClick = this.onWithdrawClick.bind(this);
    this.onClickAccountHistory = this.onClickAccountHistory.bind(this);
    this.accountFilter = this.accountFilter.bind(this);
  }

  render() {
    return (
      <div className="jumbotron">
        <h2>Account Details</h2>
        {this.accountFilter()}
        <button className="btn btn-default btn-md" onClick={this.onDepositClick}>Deposit</button>
        <button className="btn btn-default btn-md" onClick={this.onWithdrawClick}>Withdraw</button>     
        <button className="btn btn-default btn-md" onClick={this.onClickDeleteAccount}>Delete</button>
        <button className="btn btn-default btn-md" onClick={this.onClickAccountHistory}>Transactions History</button>
        <div className='div--back-button'>
          <Link to='/accounts'>
            <button className="btn btn-default btn-md">Back</button>
          </Link>
        </div>
      </div>
    );
  }
  
  accountFilter() {
    let targetAccount = undefined;
    let targetId = this.props.match.params.id;
    this.props.accounts.forEach(function(account) {
      if (account.AccountID === targetId) {
        targetAccount = account;
        console.log('accountFilter:', account.AccountID, account.Currency);
      }
    });
    if (targetAccount) {
      return <AccountDetailsTable account={targetAccount} />
    } else {
      return <p>Bad Account ID. Please go back.</p>
    }
  };

  onClickAccountHistory() {
    this.props.history.push('/transactions/' + this.props.match.params.id);
  }

  onClickDeleteAccount() {
    this.props.deleteAccount(this.props.match.params.id).then(() => {
      this.props.history.push('/accounts');
    });
  }

  onDepositClick () {
    let promptInput = prompt(`Please enter the amount you want to deposit:`);
    this.isNumber(promptInput) && promptInput != null && promptInput > 0 
      ? 
      this.props.depositAccount(this.props.match.params.id, parseFloat(promptInput))
      : 
      this.props.showStatusMessage(`Invalid amount. Please, type a valid number to deposit.`);
  }

  onWithdrawClick () {
    let promptInput = prompt(`Please enter the amount you want to withdraw:`);
    this.isNumber(promptInput) && promptInput != null && promptInput > 0 
      ? 
      this.props.withdrawAccount(this.props.match.params.id, parseFloat(promptInput))
      : 
      this.props.showStatusMessage(`Invalid amount. Please, type a valid number to withdraw.`);
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}