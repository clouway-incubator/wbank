import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { loadAccountDetails, deleteAccount, depositAccount, withdrawAccount } from '../../modules/accounts'
import { showStatusMessage } from '../../modules/status'
import AccountDetailsPage from './AccountDetailsPage'

function mapStateToProps(state) {
  return {
    accounts: state.accounts.accounts,
    accountDetails: state.accounts.accountDetails
  };
}
const mapDispatchToProps = {
  loadAccountDetails,
  deleteAccount,
  depositAccount,
  withdrawAccount,
  showStatusMessage
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountDetailsPage))