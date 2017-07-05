import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { serverLogin, logOut } from '../../modules/auth'
import HomePage from './HomePage'

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = {
  serverLogin,
  logOut
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage))