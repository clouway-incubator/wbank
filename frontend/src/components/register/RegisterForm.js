import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';

const required = value => (value ? undefined : 'Required')
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength15 = maxLength(15)
export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
export const minLength2 = minLength(2)
const number = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined
const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined
const minValue18 = minValue(18)
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
const tooOld = value =>
  value && value > 65 ? 'You might be too old for this' : undefined
const aol = value =>
  value && /.+@aol\.com/.test(value)
    ? 'Really? You still use AOL for your email?'
    : undefined
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined
const alphaOnly = value =>
  value && /[^a-zA-Z ]/i.test(value)
    ? 'Only alpha characters'
    : undefined

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} className="input--form-register" />
      {touched &&
        ((error && <div><span className="span--form-warn">{error}</span></div>) ||
          (warning && <div><span className="span--form-error">{warning}</span></div>))}
    </div>
  </div>
)

const RegisterForm = props => {
  const { handleSubmit, pristine, reset, submitting, history, registerUser } = props

  function submit(values) {
      registerUser(values)
        .then(res => {
          console.log('RegisterForm > response: ', res);
          // console.log('AuthForm > response:', res.error.response.status, res.error.response.data);
          if (res.payload) {
            console.log('RegisterForm OK');
            history.push('/login');
          }
          if (res.error) {
            console.log('RegisterForm Error');
            // throw new SubmissionError({ password: 'Wrong password', _error: 'Login failed!' })
          }
        })
        .catch(err => {
          console.log('RegisterForm > error: ', err);
          // throw new SubmissionError({ password: 'Wrong password', _error: 'Login failed!' })
        })
    }

  return (
    <div className="col-sm-4 col-sm-offset-4 well">
      <h2>Create new account</h2>
      <form onSubmit={handleSubmit(submit)}>
        <Field
          name="username"
          type="text"
          component={renderField}
          label="Username"
          validate={[required, maxLength15, minLength2]}
          warn={alphaNumeric}
        />
        <Field
          name="email"
          type="email"
          component={renderField}
          label="Email"
          validate={[required, email]}
          warn={aol}
        />
        <Field
          name="password"
          type="password"
          component={renderField}
          label="Password"
          validate={[required, maxLength15, minLength2]}
        />
        <Field
          name="name"
          type="text"
          component={renderField}
          label="Name"
          validate={[required, maxLength15, minLength2]}
          warn={alphaOnly}
        />
        <Field
          name="age"
          type="number"
          component={renderField}
          label="Age"
          validate={[required, number, minValue18]}
          warn={tooOld}
        />
        <div>
          <button type="submit" disabled={pristine || submitting} className="btn btn-default btn-lg button--form-page">Submit</button>
          <button type="button" disabled={pristine || submitting} onClick={reset} className="btn btn-default btn-lg button--form-page">
            Clear Values
        </button>
          <Link to="/login" className="btn btn-default btn-lg button--form-page">Login</Link>
        </div>
      </form>
    </div>
  )
}

export default reduxForm({
  form: 'submitRegistration' // a unique identifier for this form
})(RegisterForm)