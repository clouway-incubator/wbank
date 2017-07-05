import React from 'react';
import { Link } from 'react-router-dom';

const Logout = () => (
  <div className="jumbotron">
    <h1>Log Out successful</h1>
    <p>Do come again!</p>
    <Link to="/login" className="btn btn-default btn-lg">Login</Link>
  </div>
);

export default Logout;

