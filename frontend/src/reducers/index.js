import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

import accounts from '../modules/accounts';
import history from '../modules/history';
import status from '../modules/status';
import auth from '../modules/auth';

const rootReducer = combineReducers({
  accounts,
  history,
  status,
  auth,
  form: formReducer,
});

export default rootReducer;