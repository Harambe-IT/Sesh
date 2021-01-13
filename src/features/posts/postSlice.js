import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const createNewPost = createAsyncThunk(
  'posts/create',
  async (post, {rejectWithValue}) => {
    let uid = auth().currentUser.uid || null;
    if (!uid) return rejectWithValue("User wasn't authenticated");

    let reference = storage().ref(`/${uid}/${post.name}`);
    let task = reference.putFile(post.uri);
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
    });

    return task
      .then(() => {
        return true;
      })
      .catch((error) => {
        return rejectWithValue(error.message);
      });
  },
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    isUploading: false,
    errors: null,
  },
  reducers: {},
  extraReducers: {
    [createNewPost.pending]: (state, action) => {
      state.isUploading = true;
    },
    [createNewPost.rejected]: (state, action) => {
      state.isUploading = false;
      state.errors = action.payload;
    },
    [createNewPost.fulfilled]: (state, action) => {
      state.isUploading = false;
    },
  },
});

export default postSlice.reducer;
