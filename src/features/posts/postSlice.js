import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const createNewPost = createAsyncThunk(
  'posts/create',
  async (post, {rejectWithValue}) => {
    let uid = auth().currentUser.uid || null;
    if (!uid) return rejectWithValue({generic: "User wasn't authenticated"});
    if (!post.fileSource)
      return rejectWithValue({
        fileSource:
          'Provide a picture or video before trying to post anything.',
      });
    if (!post.description)
      return rejectWithValue({description: 'Provide a description, please.'});
    if (!post.title)
      return rejectWithValue({description: 'Provide a title, please.'});

    let postFileReference = storage().ref(`/${uid}/${post.fileSource.name}`);
    let uploadTask = postFileReference.putFile(post.fileSource.uri);

    uploadTask.on('state_changed', (taskSnapshot) => {
      let totalBytes = taskSnapshot.totalBytes;
      let currentBytesTransferred = taskSnapshot.bytesTransferred;
      let percentage = Math.floor((currentBytesTransferred / totalBytes) * 100);
      uploadProgressChanged(percentage);
    });

    return uploadTask
      .then(() => {
        return postFileReference.getDownloadURL();
      })
      .then((downloadURL) => {
        return firestore().collection('posts').add({
          contentUrl: downloadURL,
          createdOn: firestore.FieldValue.serverTimestamp(),
          description: post.description.trim(),
          ownerId: uid,
          title: post.title.trim(),
          type: post.photo.type,
        });
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return rejectWithValue(err);
      });
  },
);

const uploadProgressChanged = createAsyncThunk(
  'posts/uploadProgressChanged',
  async (progress, {rejectWithValue}) => {
    if (progress) return progress;
    else rejectWithValue('Percentage could not be shown.');
  },
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    isUploading: false,
    uploadPercentage: null,
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
      state.uploadPercentage = null;
    },
    [uploadProgressChanged.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [uploadProgressChanged.fulfilled]: (state, action) => {
      state.uploadPercentage = action.payload;
    },
  },
});

export default postSlice.reducer;
