import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { logOut } from '../../modules/auth';

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar--main">
        <Link to="/" className="link--navbar-item">HOME</Link>
        {' | '}
        <Link to="/accounts" className="link--navbar-item">ACCOUNTS</Link>
        {' | '}
        {this.AuthLink()}
      </nav>
    );
  }

  AuthLink () {
    if (this.props.auth.isLoggedIn) {
      return <Link to="/logout" onClick={this.props.logOut} className="link--navbar-item">LOGOUT</Link>;
    } else {
      return <Link to="/login" className="link--navbar-item">LOGIN</Link>;
    }
  }

}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}
const mapDispatchToProps = {
  logOut
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar));