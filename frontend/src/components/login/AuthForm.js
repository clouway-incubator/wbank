import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';

const AuthForm = (props) => {
  const { handleSubmit, pristine, reset, submitting, serverLogin, history, auth } = props;

  function submit(values) {

    serverLogin(values)
      .then(res => {
        console.log('AuthForm > response:', res);
        if (res.payload) {
          const session = res.payload.data;
          console.log('AuthForm Login OK');
          history.push('/');
          console.log('Redirecting to /');
          setCookie(session.UserID, session.SessionID, session.Expires);
        }
        if (res.error) {
          console.log('AuthForm Login Error:', res.error);
        }
      })
      .catch(err => {
        console.log('AuthForm > error:', err);
      })
    
    function setCookie(UserID, SessionID, Expires) {
      document.cookie = ["SID=", SessionID, " ; Expires=", Expires, " ; path=/"].join('');
      console.log("setCookie >", document.cookie);
    } 
  }

  function renderField({ input, label, type, meta: { touched, error } }) {
    return (
      <div>
        <label>{label}</label>
        <div>
          <input {...input} type={type} className="input--form-auth" />
        </div>
      </div>
    )
  }

  function showAuthError() {
    if (auth.message) {
      return (
        <div>
          <span className='span--form-error'>
            {auth.message}
          </span>
        </div>
      );
    } 
  }

  return (
    <div className="col-sm-4 col-sm-offset-4 well">
      <h2>Redux Bank App</h2>
      <form onSubmit={handleSubmit(submit)}>
        <Field
          name="username"
          type="text"
          component={renderField}
          label="Username"
        />
        <Field
          name="password"
          type="password"
          component={renderField}
          label="Password"
        />
        {showAuthError()}
        <div>
          <button type="submit" className="btn btn-default btn-lg button--form-page" disabled={pristine || submitting}>Log In</button>
          <button type="button" className="btn btn-default btn-lg button--form-page" disabled={pristine || submitting} onClick={reset}>
            Clear Values
        </button>
          <p className="footer--form-page">Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'submitValidation'
})(AuthForm);