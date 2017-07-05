import React from 'react'
import {Link} from 'react-router-dom'
import AccountDetailsTable from './AccountDetailsTable'

export default class AccountDetailsPage extends React.Component {
  constructor(props){
    super(props)

    this.onDeleteAccount = this.onDeleteAccount.bind(this)
    this.onDeposit = this.onDeposit.bind(this)
    this.onWithdraw = this.onWithdraw.bind(this)
    this.onAccountHistory = this.onAccountHistory.bind(this)
  }

  componentDidMount() {    
    this.props.loadAccountDetails(this.props.match.params.id)      
  }

  render() {
    const { loading } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    if (!this.props.accountDetails) {
      return <p>Bad Account ID. Please go back.</p> 
    }

    return (
      <div className="jumbotron">
        <h2>Account Details</h2>
        <AccountDetailsTable account={this.props.accountDetails} />
        <button className="btn btn-default btn-md" onClick={this.onDeposit}>Deposit</button>
        <button className="btn btn-default btn-md" onClick={this.onWithdraw}>Withdraw</button>     
        <button className="btn btn-default btn-md" onClick={this.onDeleteAccount}>Delete</button>
        <button className="btn btn-default btn-md" onClick={this.onAccountHistory}>Transactions History</button>
        <div className='div--back-button'>
          <Link to='/accounts'>
            <button className="btn btn-default btn-md">Back</button>
          </Link>
        </div>
      </div>
    )
  }

  onAccountHistory() {    
    this.props.history.push('/transactions/' + this.props.match.params.id)
  }

  onDeleteAccount() {
    const { history } = this.props    
    this.props.deleteAccount(this.props.match.params.id)
    .then(() => {                        
      history.push('/accounts')      
    })
  }

  onDeposit () {
    let promptInput = prompt(`Please enter the amount you want to deposit:`)
    this.isNumber(promptInput) && promptInput != null && promptInput > 0 
      ? 
      this.props.depositAccount(this.props.match.params.id, parseFloat(promptInput))
      : 
      this.props.showStatusMessage(`Invalid amount. Please, type a valid number to deposit.`)
  }

  onWithdraw () {
    let promptInput = prompt(`Please enter the amount you want to withdraw:`)
    this.isNumber(promptInput) && promptInput != null && promptInput > 0 
      ? 
      this.props.withdrawAccount(this.props.match.params.id, parseFloat(promptInput))
      : 
      this.props.showStatusMessage(`Invalid amount. Please, type a valid number to withdraw.`)
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }
}