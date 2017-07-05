import React from 'react'
import ReactDOM from 'react-dom'
import { Provider }from 'react-redux'

import configureStore from './store/configureStore'
import App from './components/App'

import './index.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import { loggedIn } from './modules/auth'

const store = configureStore()

const getCookie = () => {
  if (document.cookie && decodeURIComponent(document.cookie).split('=')[0] === 'SID') {
      return document.cookie
    }
    return ''
  }

if (getCookie()) {
  store.dispatch(loggedIn())
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
)