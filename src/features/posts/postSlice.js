import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const MAX_DELTA = 100 / 110.4; // Around 100km

export const createNewPost = createAsyncThunk(
  'posts/create',
  async (post, {rejectWithValue}) => {
    let errorObject = {};
    let uid = auth().currentUser.uid || null;
    if (!uid) errorObject.generic = "User wasn't authenticated";
    if (!post.fileSource)
      errorObject.generic =
        'Provide a picture or video before trying to post anything.';
    if (!post.title || post.title.trim() === '')
      errorObject.title = 'Provide a title, please.';
    if (!post.region)
      errorObject.generic = 'Enable location to post a new picture/video.';

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
            owner: firestore().collection('users').doc(uid),
            title: post.title.trim(),
            type: post.fileSource.type?.includes('image') ? 'picture' : 'clip',
            location: {...post.region},
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

export const getAllPostsByRegion = createAsyncThunk(
  'posts/getAllPostsByRegion',
  async (region, {rejectWithValue}) => {
    let latitudeDelta = region.latitudeDelta;
    let longitudeDelta = region.longitudeDelta;
    if (latitudeDelta > MAX_DELTA) latitudeDelta = MAX_DELTA;
    if (longitudeDelta > MAX_DELTA) longitudeDelta = MAX_DELTA;

    return firestore()
      .collection('posts')
      .where('location.latitude', '>=', region.latitude - latitudeDelta)
      .where('location.latitude', '<=', region.latitude + latitudeDelta)
      .get()
      .then(async (snapshot) => {
        let posts = [];
        let promises = [];

        console.log(snapshot.size, 'posts found');
        snapshot.forEach((doc) => {
          let tempPost = {
            docId: doc.id,
            ...doc.data(),
            createdOn: doc.data().createdOn.seconds,
            location: {
              longitude: doc.data().location.longitude,
              latitude: doc.data().location.latitude,
            },
          };

          if (
            tempPost.location.longitude >= region.longitude - longitudeDelta &&
            tempPost.location.longitude <= region.longitude + longitudeDelta
          ) {
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
          }
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
  async ({postId, page}, {rejectWithValue}) => {
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
                return {liked: true, postId, owner, page};
              });
          });
        } else {
          return postLikesReference
            .doc(snapshot.docs[0].id)
            .delete()
            .then(() => {
              return {liked: false, postId, uid, page};
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
    postsFollowing: null,
    postsByLocation: null,
  },
  reducers: {
    resetCreateErrors: (state, action) => {
      state.errors = null;
    },
  },
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
      state.postsFollowing = action.payload;
    },
    [getFollowingPosts.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
    },
    [getAllPostsByRegion.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
    },
    [getAllPostsByRegion.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.postsByLocation = action.payload;
    },
    [getAllPostsByRegion.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
      console.log(JSON.stringify(action, null, 2));
    },
    [likePost.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
    },
    [likePost.fulfilled]: (state, action) => {
      state.isFetching = false;

      const {liked, postId, page} = action.payload;
      let indexPostElement;

      if (page === 'Explore') {
        let tempPostElement = state.postsFollowing.filter((el, i) => {
          if (el.docId === postId) indexPostElement = i;
          return el.docId === postId;
        })[0];

        if (liked) {
          const {owner} = action.payload;
          tempPostElement.likes.push({owner});
          state.postsFollowing[indexPostElement] = tempPostElement;
        } else {
          const {uid} = action.payload;
          tempPostElement.likes = tempPostElement.likes.filter(
            (like) => like.owner.uid !== uid,
          );
          state.postsFollowing[indexPostElement] = tempPostElement;
        }
      } else {
        let tempPostElement = state.postsByLocation.filter((el, i) => {
          if (el.docId === postId) indexPostElement = i;
          return el.docId === postId;
        })[0];

        if (liked) {
          const {owner} = action.payload;
          tempPostElement.likes.push({owner});
          state.postsByLocation[indexPostElement] = tempPostElement;
        } else {
          const {uid} = action.payload;
          tempPostElement.likes = tempPostElement.likes.filter(
            (like) => like.owner.uid !== uid,
          );
          state.postsByLocation[indexPostElement] = tempPostElement;
        }
      }
    },
    [likePost.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = null;
    },
  },
});

export const {resetCreateErrors} = postSlice.actions;
export default postSlice.reducer;
