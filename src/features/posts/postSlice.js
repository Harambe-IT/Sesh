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
      .orderBy('createdOn')
      .get()
      .then(async (snapshot) => {
        let posts = [];
        let promises = [];

        snapshot.forEach((doc) => {
          let tempPost = {
            docId: doc.id,
            ...doc.data(),
            createdOn: doc.data().createdOn.seconds,
          };

          let getOwnerData = doc
            .data()
            .owner.get()
            .then((doc) => {
              tempPost.owner = {
                uid: doc.id,
                ...doc.data(),
                createdOn: doc.data().createdOn.seconds,
              };
            });

          let getLikes = getLikesFromPost(tempPost.docId).then((likes) => {
            tempPost.likes = likes;
          });

          let getReactions = getReactionsFromPost(tempPost.docId).then(
            (reactions) => {
              tempPost.reactions = reactions;
            },
          );

          let addToList = Promise.all([
            getOwnerData,
            getLikes,
            getReactions,
          ]).then(() => {
            posts.push(tempPost);
          });

          promises.push(addToList);
        });

        return Promise.all(promises).then(() => {
          return posts;
        });
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

const getLikesFromPost = async (postId) => {
  return firestore()
    .collection('posts')
    .doc(postId)
    .collection('likes')
    .get()
    .then(async (snapshot) => {
      let likes = [];
      let likePromises = [];

      snapshot.forEach((doc) => {
        let tempLike = {
          docId: doc.id,
        };

        let getLikeOwnerData = doc
          .data()
          .owner.get()
          .then((doc) => {
            tempLike.owner = {
              uid: doc.id,
              ...doc.data(),
              createdOn: doc.data().createdOn.seconds,
            };

            likes.push(tempLike);
          });

        likePromises.push(getLikeOwnerData);
      });

      return Promise.all(likePromises).then(() => {
        return likes;
      });
    });
};

const getReactionsFromPost = async (postId) => {
  return firestore()
    .collection('posts')
    .doc(postId)
    .collection('reactions')
    .get()
    .then(async (snapshot) => {
      let reactions = [];
      let reactionPromises = [];

      snapshot.forEach((doc) => {
        let tempReaction = {
          docId: doc.id,
          ...doc.data(),
          createdOn: doc.data().createdOn.seconds,
        };

        let getReactionOwnerData = doc
          .data()
          .owner.get()
          .then((doc) => {
            tempReaction.owner = {
              uid: doc.id,
              ...doc.data(),
              createdOn: doc.data().createdOn.seconds,
            };

            reactions.push(tempReaction);
          });

        reactionPromises.push(getReactionOwnerData);
      });

      return Promise.all(reactionPromises).then(() => {
        return reactions;
      });
    });
};

const uploadProgressChanged = createAsyncThunk(
  'posts/uploadProgressChanged',
  async (progress, {rejectWithValue}) => {
    if (progress) return progress;
    else rejectWithValue('Percentage could not be shown.');
  },
);

export const likePost = createAsyncThunk(
  'posts/like',
  async (postId, {rejectWithValue}) => {
    let uid = auth().currentUser.uid;
    let userReference = firestore().collection('users').doc(uid);
    let postLikesReference = firestore()
      .collection('posts')
      .doc(postId)
      .collection('likes');

    return postLikesReference
      .where('owner', '==', userReference)
      .get()
      .then(async (snapshot) => {
        if (snapshot.empty) {
          return postLikesReference.add({owner: userReference}).then(() => {
            return userReference
              .get()
              .then((doc) => {
                return {
                  uid: doc.id,
                  ...doc.data(),
                  createdOn: doc.data().createdOn.seconds,
                };
              })
              .then((owner) => {
                return {liked: true, postId, owner};
              });
          });
        } else {
          return postLikesReference
            .doc(snapshot.docs[0].id)
            .delete()
            .then(() => {
              return {liked: false, postId, uid};
            });
        }
      })
      .catch((err) => {
        return rejectWithValue(err);
      });
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
    posts: null,
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
    },
    [likePost.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
    },
    [likePost.fulfilled]: (state, action) => {
      state.isFetching = false;

      const {liked, postId} = action.payload;
      let indexPostElement;
      let tempPostElement = state.posts.filter((el, i) => {
        if (el.docId === postId) indexPostElement = i;
        return el.docId === postId;
      })[0];

      if (liked) {
        const {owner} = action.payload;
        tempPostElement.likes.push({owner});
        state.posts[indexPostElement] = tempPostElement;
      } else {
        const {uid} = action.payload;
        tempPostElement.likes = tempPostElement.likes.filter(
          (like) => like.owner.uid !== uid,
        );
        state.posts[indexPostElement] = tempPostElement;
      }
    },
    [likePost.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = null;
    },
  },
});

export const {resetLiked} = postSlice.actions;
export default postSlice.reducer;
