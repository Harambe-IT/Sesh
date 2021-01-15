import {combineReducers} from 'redux';

import authReducer from '../features/authentication/authenticationSlice';
import postReducer from '../features/posts/postSlice';
import routingReducer from '../features/helpers/routingSlice';

export default combineReducers({
  auth: authReducer,
  posts: postReducer,
  routing: routingReducer,
});
