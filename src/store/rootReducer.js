import {combineReducers} from 'redux';

import authReducer from '../features/authentication/authenticationSlice';
import postReducer from '../features/posts/postSlice';

export default combineReducers({
  auth: authReducer,
  posts: postReducer,
});
