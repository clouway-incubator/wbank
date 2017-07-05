import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { loadHistory } from '../../modules/history';
import AccountHistoryPage from './AccountHistoryPage';

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    history: state.history
  };
}
const mapDispatchToProps = {
  loadHistory
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountHistoryPage));

