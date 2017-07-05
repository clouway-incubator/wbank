import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router';
import Home from './home';
import Login from './login';
import Logout from './logout';
import Register from './register';
import Accounts from './accounts';
import AccountDetails from './accountdetails';
import AccountHistory from './accounthistory';
import Navbar from './navbar';
import Statusbar from './statusbar';
import PrivateRoute from './PrivateRoute';

class Routes extends React.Component {

  render() {
    return (
      <div>
        <Navbar />
        <Statusbar />
        <Route exact path='/' component={Home} />
        <PrivateRoute path='/accounts' component={Accounts} auth={this.props.auth.isLoggedIn} />
        <PrivateRoute path="/account/:id" component={AccountDetails} auth={this.props.auth.isLoggedIn} />
        <PrivateRoute path="/transactions/:id" component={AccountHistory} auth={this.props.auth.isLoggedIn} />
        <Route path='/login' component={Login} />
        <Route path='/logout' component={Logout} />
        <Route path='/register' component={Register} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}
export default withRouter(connect(
  mapStateToProps
)(Routes));