import { connect } from 'react-redux'
import AccountsPage from './AccountsPage'
import { createAccount, loadAccounts } from '../../modules/accounts'
import { showStatusMessage } from '../../modules/status'

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts.accounts
  }
}
const mapDispatchToProps = {
  loadAccounts,
  createAccount,
  showStatusMessage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountsPage)