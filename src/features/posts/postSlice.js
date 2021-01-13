import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import {googleClientID} from '../../config/keys';

export const createNewPost = createAsyncThunk(
  'posts/create',
  async (post, {rejectWithValue}) => {
    return auth()
      .signInWithEmailAndPassword(creds.email, creds.password)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return rejectWithValue(error.message);
      });
  },
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    isFetching: false,
    errors: null,
  },
  reducers: {},
  extraReducers: {},
});

export default postSlice.reducer;
