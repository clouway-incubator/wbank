import React from 'react';
import { Link } from 'react-router-dom';

export default class HomePage extends React.Component {

  render() {
    return (
      <div className="jumbotron">
        <h1>Redux Bank App</h1>
        {this.AuthMessage()}
      </div>
    );
  }

  AuthMessage () {
      if (this.props.auth.isLoggedIn) {
        return (
          <div>
          <p>Now you can access your <Link to="/accounts">Bank Accounts</Link>.</p>
          <button className='btn btn-default btn-sm' onClick={this.props.logOut}>Logout</button>
          </div>
        );
      } else {
        return (
          <div>
            <p>You are not logged in.</p>
            <Link to="/login" className="link--navbar-item">
              <button className='btn btn-default btn-lg'>Login</button>
            </Link>
          </div>
        );
      }
  }
}