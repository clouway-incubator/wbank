import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { serverLogin, logOut } from '../../modules/auth';
import HomePage, { AuthMessage } from './HomePage';

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

const mapDispatchToProps = {
  serverLogin,
  logOut
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage));