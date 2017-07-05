import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteAccount, depositAccount, withdrawAccount } from '../../modules/accounts';
import { showStatusMessage } from '../../modules/status';
import AccountDetailsPage from './AccountDetailsPage';

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
  };
}
const mapDispatchToProps = {
  deleteAccount,
  depositAccount,
  withdrawAccount,
  showStatusMessage
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountDetailsPage));