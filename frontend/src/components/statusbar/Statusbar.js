import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { resetAuthMessage } from '../../modules/auth';
import { resetStatusMessage } from '../../modules/status';
import StatusbarPage from './StatusbarPage';

function mapStateToProps(state) {
  return {
    status: state.status,
    auth: state.auth
  };
}
const mapDispatchToProps = {
  resetStatusMessage,
  resetAuthMessage
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusbarPage));