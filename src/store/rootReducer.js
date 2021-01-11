import {combineReducers} from 'redux';

import authReducer from '../features/authentication/authenticationSlice';

export default combineReducers({
  auth: authReducer,
});
