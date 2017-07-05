import React from 'react';
import ReactDOM from 'react-dom';
import { Provider }from 'react-redux';

import configureStore from './store/configureStore';
import App from './components/App';
// import { loadAccounts } from './modules/accounts';

import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const store = configureStore();
// store.dispatch(loadAccounts());
// console.log('Store > getState:', store.getState());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
);