import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const createNewPost = createAsyncThunk(
  'posts/create',
  async (post, {rejectWithValue}) => {
    let errorObject = {};
    let uid = auth().currentUser.uid || null;
    if (!uid) errorObject.generic = "User wasn't authenticated";
    if (!post.fileSource)
      errorObject.fileSource =
        'Provide a picture or video before trying to post anything.';
    if (!post.description || post.description.trim() === '')
      errorObject.description = 'Provide a description, please.';
    if (!post.title || post.title.trim() === '')
      errorObject.title = 'Provide a title, please.';

    if (Object.keys(errorObject).length > 0)
      return rejectWithValue(errorObject);

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
        return firestore()
          .collection('posts')
          .add({
            contentUrl: downloadURL,
            createdOn: firestore.FieldValue.serverTimestamp(),
            description: post.description.trim(),
            owner: firestore().collection('users').doc(uid),
            title: post.title.trim(),
            type: post.fileSource.type?.includes('image') ? 'picture' : 'clip',
          });
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        return rejectWithValue(err);
      });
  },
);

export const getFollowingPosts = createAsyncThunk(
  'posts/getFollowing',
  async (user, {rejectWithValue}) => {
    let uids = user.following.map((f) => {
      return firestore().collection('users').doc(f.followedId);
    });

    // Add own id aswell
    uids.push(firestore().collection('users').doc(user.uid));

    return firestore()
      .collection('posts')
      .where('owner', 'in', uids)
      .get()
      .then((snapshot) => {
        let posts = [];
        let promises = [];

        snapshot.forEach((doc) => {
          let tempPost = {
            docId: doc.id,
            ...doc.data(),
            createdOn: doc.data().createdOn.seconds,
          };

          // TODO: GET LIKES AND REACTIONS WITH A PROMISE
          let getReferences = doc
            .data()
            .owner.get()
            .then((doc) => {
              tempPost.owner = {
                uid: doc.id,
                ...doc.data(),
                createdOn: doc.data().createdOn.seconds,
              };

              posts.push(tempPost);
            });

          promises.push(getReferences);
        });

        return Promise.all(promises).then(() => {
          return posts;
        });
      })
      .catch((err) => {
        console.log('error', err);
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
    isFetching: false,
    isUploading: false,
    uploadPercentage: null,
    errors: null,
    uploaded: false,
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
      state.uploaded = action.payload;
    },
    [uploadProgressChanged.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [uploadProgressChanged.fulfilled]: (state, action) => {
      state.uploadPercentage = action.payload;
    },
    [getFollowingPosts.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
      state.uploaded = false;
    },
    [getFollowingPosts.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.posts = action.payload;
    },
    [getFollowingPosts.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
      console.log(JSON.stringify(action, null, 2));
    },
  },
});

export default postSlice.reducer;
