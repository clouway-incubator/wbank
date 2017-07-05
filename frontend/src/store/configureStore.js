import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { composeWithDevTools } from 'redux-devtools-extension';

const configureStore = () => {
    
  const client = axios.create({
    baseURL:'/v1',
    responseType: 'json'
  });

  const middlewares = [thunk, axiosMiddleware(client)];

  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
}

export default configureStore;