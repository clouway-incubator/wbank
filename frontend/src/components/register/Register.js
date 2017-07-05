import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { registerUser } from '../../modules/auth';
import RegisterForm from './RegisterForm';

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

const mapDispatchToProps = {
  registerUser
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm));