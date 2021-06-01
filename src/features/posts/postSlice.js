import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import storage from "@react-native-firebase/storage";
import auth, {firebase} from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const MAX_DELTA = 100 / 1104; // Around 100km

export const createNewPost = createAsyncThunk(
  "posts/create",
  async (post, {rejectWithValue}) => {
    let uid = auth().currentUser.uid || null;
    if (!uid) return rejectWithValue("User wasn't authenticated");
    if (!post.fileSource)
      return rejectWithValue(
        "Provide a picture or video before trying to post anything.",
      );
    if (!post.title || post.title.trim() === "")
      return rejectWithValue("Provide a title, please.");
    if (!post.region)
      return rejectWithValue("Enable location to post a new picture/video.");

    let postFileReference = storage().ref(`/${uid}/${post.fileSource.name}`);
    let uploadTask = postFileReference.putFile(post.fileSource.uri);

    uploadTask.on("state_changed", (taskSnapshot) => {
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
          .collection("posts")
          .add({
            contentUrl: downloadURL,
            createdOn: firestore.FieldValue.serverTimestamp(),
            owner: firestore().collection("users").doc(uid),
            title: post.title.trim(),
            type: post.fileSource.type?.includes("image") ? "picture" : "clip",
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

export const createNewSpot = createAsyncThunk(
  "posts/createSpot",
  async (spot, {rejectWithValue}) => {
    let uid = auth().currentUser.uid || null;
    if (!uid) return rejectWithValue("User wasn't authenticated");
    if (!spot.fileSource)
      return rejectWithValue(
        "Provide a picture or video before trying to post anything.",
      );
    if (!spot.title || spot.title.trim() === "")
      return rejectWithValue("Provide a title, please.");
    if (!spot.description || spot.description.trim() === "")
      return rejectWithValue("Provide a description, please.");
    if (!spot.region)
      return rejectWithValue("Enable location to post a new spot.");

    if (!spot.region)
      return rejectWithValue("Enable location to post a new picture/video.");

    let spotFileReference = storage().ref(`/${uid}/${spot.fileSource.name}`);
    let uploadTask = spotFileReference.putFile(spot.fileSource.uri);

    uploadTask.on("state_changed", (taskSnapshot) => {
      let totalBytes = taskSnapshot.totalBytes;
      let currentBytesTransferred = taskSnapshot.bytesTransferred;
      let percentage = Math.floor((currentBytesTransferred / totalBytes) * 100);
      uploadProgressChanged(percentage);
    });

    return uploadTask
      .then(() => {
        return spotFileReference.getDownloadURL();
      })
      .then((downloadURL) => {
        return firestore()
          .collection("spots")
          .add({
            contentUrl: downloadURL,
            createdOn: firestore.FieldValue.serverTimestamp(),
            owner: firestore().collection("users").doc(uid),
            title: spot.title.trim(),
            type: "spot",
            description: spot.description.trim(),
            location: {...spot.region},
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

export const getPostsByUser = createAsyncThunk(
  "posts/getByUser",
  async (uid, {rejectWithValue}) => {
    let user = firestore().collection("users").doc(uid);

    return firestore()
      .collection("posts")
      .where("owner", "==", user)
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

          let getLikes = getLikesFrom("posts", tempPost.docId).then((likes) => {
            tempPost.likes = likes;
          });

          let getReactions = getReactionsFrom("posts", tempPost.docId).then(
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
          return posts.sort((a, b) => {
            return b.createdOn - a.createdOn;
          });
        });
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const getSpotsByUser = createAsyncThunk(
  "spots/getByUser",
  async (uid, {rejectWithValue}) => {
    let user = firestore().collection("users").doc(uid);

    return firestore()
      .collection("spots")
      .where("owner", "==", user)
      .get()
      .then(async (snapshot) => {
        let spots = [];
        let promises = [];

        snapshot.forEach((doc) => {
          let tempSpot = {
            docId: doc.id,
            ...doc.data(),
            createdOn: doc.data().createdOn.seconds,
          };

          let getOwnerData = doc
            .data()
            .owner.get()
            .then((doc) => {
              tempSpot.owner = {
                uid: doc.id,
                ...doc.data(),
                createdOn: doc.data().createdOn.seconds,
              };
            });

          let getLikes = getLikesFrom("spots", tempSpot.docId).then((likes) => {
            tempSpot.likes = likes;
          });

          let getReactions = getReactionsFrom("spots", tempSpot.docId).then(
            (reactions) => {
              tempSpot.reactions = reactions;
            },
          );

          let addToList = Promise.all([
            getOwnerData,
            getLikes,
            getReactions,
          ]).then(() => {
            spots.push(tempSpot);
          });

          promises.push(addToList);
        });

        return Promise.all(promises).then(() => {
          return spots.sort((a, b) => {
            return b.createdOn - a.createdOn;
          });
        });
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const getFollowingPosts = createAsyncThunk(
  "posts/getFollowing",
  async (user, {rejectWithValue}) => {
    let uids = user.following.map((f) => {
      return firestore().collection("users").doc(f.followedId);
    });

    // Add own id aswell
    uids.push(firestore().collection("users").doc(user.uid));

    return firestore()
      .collection("posts")
      .where("owner", "in", uids)
      .get()
      .then(async (snapshot) => {
        let posts = [];
        let promises = [];

        snapshot.forEach((doc) => {
          let tempPost = {
            docId: doc.id,
            ...doc.data(),
            createdOn: doc.data()?.createdOn?.seconds || null,
          };

          let ownerData = doc
            .data()
            .owner.get()
            .then((doc) => {
              tempPost.owner = {
                uid: doc.id,
                ...doc.data(),
                createdOn: doc.data()?.createdOn?.seconds || null,
              };
            });

          let likes = getLikesFrom("posts", tempPost.docId).then((likes) => {
            tempPost.likes = likes;
          });

          let reactions = getReactionsFrom("posts", tempPost.docId).then(
            (reactions) => {
              tempPost.reactions = reactions;
            },
          );

          let addToList = Promise.all([ownerData, likes, reactions]).then(
            () => {
              posts.push(tempPost);
            },
          );

          promises.push(addToList);
        });

        return Promise.all(promises).then(() => {
          let temp = posts.sort((a, b) => {
            return b.createdOn - a.createdOn;
          });

          return temp;
        });
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const getAllPostsByRegion = createAsyncThunk(
  "posts/getAllPostsByRegion",
  async (region, {rejectWithValue}) => {
    let latitudeDelta = region.latitudeDelta;
    let longitudeDelta = region.longitudeDelta;
    if (latitudeDelta > MAX_DELTA) latitudeDelta = MAX_DELTA;
    if (longitudeDelta > MAX_DELTA) longitudeDelta = MAX_DELTA;

    return firestore()
      .collection("posts")
      .where("location.latitude", ">=", region.latitude - latitudeDelta)
      .where("location.latitude", "<=", region.latitude + latitudeDelta)
      .get()
      .then(async (snapshot) => {
        let posts = [];
        let promises = [];

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

            let getLikes = getLikesFrom("posts", tempPost.docId).then(
              (likes) => {
                tempPost.likes = likes;
              },
            );

            let getReactions = getReactionsFrom("posts", tempPost.docId).then(
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
          return posts.sort((a, b) => {
            return b.createdOn - a.createdOn;
          });
        });
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const getAllSpotsByRegion = createAsyncThunk(
  "posts/getAllSpotsByRegion",
  async (region, {rejectWithValue}) => {
    let latitudeDelta = region.latitudeDelta;
    let longitudeDelta = region.longitudeDelta;
    if (latitudeDelta > MAX_DELTA) latitudeDelta = MAX_DELTA;
    if (longitudeDelta > MAX_DELTA) longitudeDelta = MAX_DELTA;

    return firestore()
      .collection("spots")
      .where("location.latitude", ">=", region.latitude - latitudeDelta)
      .where("location.latitude", "<=", region.latitude + latitudeDelta)
      .get()
      .then(async (snapshot) => {
        let spots = [];
        let promises = [];

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

            let getLikes = getLikesFrom("spots", tempPost.docId).then(
              (likes) => {
                tempPost.likes = likes;
              },
            );

            let getReactions = getReactionsFrom("spots", tempPost.docId).then(
              (reactions) => {
                tempPost.reactions = reactions;
              },
            );

            let addToList = Promise.all([
              getOwnerData,
              getLikes,
              getReactions,
            ]).then(() => {
              spots.push(tempPost);
            });

            promises.push(addToList);
          }
        });

        return Promise.all(promises).then(() => {
          return spots.sort((a, b) => {
            return b.createdOn - a.createdOn;
          });
        });
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (docId, {rejectWithValue}) => {
    return firestore()
      .collection("posts")
      .doc(docId)
      .get()
      .then(async (doc) => {
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

        let getLikes = getLikesFrom("posts", tempPost.docId).then((likes) => {
          tempPost.likes = likes;
        });

        let getReactions = getReactionsFrom("posts", tempPost.docId).then(
          (reactions) => {
            tempPost.reactions = reactions;
          },
        );

        return Promise.all([getOwnerData, getLikes, getReactions]).then(() => {
          return tempPost;
        });
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const getSpotById = createAsyncThunk(
  "posts/getSpotById",
  async (docId, {rejectWithValue}) => {
    return firestore()
      .collection("spots")
      .doc(docId)
      .get()
      .then(async (doc) => {
        let tempSpot = {
          docId: doc.id,
          ...doc.data(),
          createdOn: doc.data().createdOn.seconds,
        };

        let getOwnerData = doc
          .data()
          .owner.get()
          .then((doc) => {
            tempSpot.owner = {
              uid: doc.id,
              ...doc.data(),
              createdOn: doc.data().createdOn.seconds,
            };
          });

        let getLikes = getLikesFrom("spots", tempSpot.docId).then((likes) => {
          tempSpot.likes = likes;
        });

        let getReactions = getReactionsFrom("spots", tempSpot.docId).then(
          (reactions) => {
            tempSpot.reactions = reactions;
          },
        );

        return Promise.all([getOwnerData, getLikes, getReactions]).then(() => {
          return tempSpot;
        });
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

const getLikesFrom = async (collection, document) => {
  return firestore()
    .collection(collection)
    .doc(document)
    .collection("likes")
    .get()
    .then(async (snapshot) => {
      if (snapshot.empty) return [];

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

const getReactionsFrom = async (collection, document) => {
  return firestore()
    .collection(collection)
    .doc(document)
    .collection("reactions")
    .orderBy("createdOn", "desc")
    .get()
    .then(async (snapshot) => {
      if (snapshot.empty) return Promise.resolve([]);

      let reactions = [];
      let reactionPromises = [];

      snapshot.forEach((doc) => {
        let tempReaction = {
          docId: doc.id,
          ...doc.data(),
          createdOn: doc.data()?.createdOn?.seconds || null,
        };

        let getReactionOwnerData = doc
          .data()
          .owner.get()
          .then((doc) => {
            tempReaction.owner = {
              uid: doc.id,
              ...doc.data(),
              createdOn: doc.data()?.createdOn?.seconds || null,
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
  "posts/uploadProgressChanged",
  async (progress, {rejectWithValue}) => {
    if (progress) return progress;
    else return rejectWithValue("Percentage could not be shown.");
  },
);

export const likePost = createAsyncThunk(
  "posts/like",
  async ({postId, page}, {rejectWithValue}) => {
    let uid = auth().currentUser.uid;
    let userReference = firestore().collection("users").doc(uid);
    let postLikesReference = firestore()
      .collection("posts")
      .doc(postId)
      .collection("likes");

    return postLikesReference
      .where("owner", "==", userReference)
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
      .catch((err) => rejectWithValue(err));
  },
);

export const likeSpot = createAsyncThunk(
  "posts/likeSpot",
  async ({spotId}, {rejectWithValue}) => {
    let uid = auth().currentUser.uid;
    let userReference = firestore().collection("users").doc(uid);
    let spotLikesReference = firestore()
      .collection("spots")
      .doc(spotId)
      .collection("likes");

    return spotLikesReference
      .where("owner", "==", userReference)
      .get()
      .then(async (snapshot) => {
        if (snapshot.empty) {
          return spotLikesReference.add({owner: userReference}).then(() => {
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
                return {liked: true, owner};
              });
          });
        } else {
          return spotLikesReference
            .doc(snapshot.docs[0].id)
            .delete()
            .then(() => {
              return {liked: false, uid};
            });
        }
      })
      .catch((err) => rejectWithValue(err));
  },
);

export const reactPost = createAsyncThunk(
  "posts/react",
  async ({postId, reaction}, {rejectWithValue}) => {
    if (reaction.trim() === "") rejectWithValue("No content");

    let uid = auth().currentUser.uid;
    let userReference = firestore().collection("users").doc(uid);
    let postReactionReference = firestore()
      .collection("posts")
      .doc(postId)
      .collection("reactions");

    return postReactionReference
      .add({
        owner: userReference,
        text: reaction,
        createdOn: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => true)
      .catch((err) => rejectWithValue(err));
  },
);

export const reactSpot = createAsyncThunk(
  "posts/reactSpot",
  async ({spotId, reaction}, {rejectWithValue}) => {
    if (reaction.trim() === "") rejectWithValue("No content");

    let uid = auth().currentUser.uid;
    let userReference = firestore().collection("users").doc(uid);
    let spotReactionReference = firestore()
      .collection("spots")
      .doc(spotId)
      .collection("reactions");

    return spotReactionReference
      .add({
        owner: userReference,
        text: reaction,
        createdOn: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => true)
      .catch((err) => rejectWithValue(err));
  },
);

const initialState = {
  isFetching: false,
  isUploading: false,
  uploadPercentage: null,
  errors: null,
  uploaded: false,
  postsFollowing: null,
  postsByLocation: null,
  spotsByLocation: null,
  postsByUser: null,
  postById: null,
  spotById: null,
  spotsByUser: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    resetCreateErrors: (state, action) => {
      state.errors = null;
    },
    reset: (state) => initialState,
    updateComments: (state, action) => {
      if (state.postById)
        state.postById = {...state.postById, reactions: action.payload};
    },
    updateCommentsSpot: (state, action) => {
      if (state.spotById)
        state.spotById = {...state.spotById, reactions: action.payload};
    },
  },
  extraReducers: {
    [createNewPost.pending]: (state, action) => {
      state.isUploading = true;
    },
    [createNewPost.rejected]: (state, action) => {
      state.isUploading = false;
      state.errors = "The upload failed. Try again later";
    },
    [createNewPost.fulfilled]: (state, action) => {
      state.isUploading = false;
      state.uploadPercentage = null;
      state.uploaded = action.payload;
    },
    [createNewSpot.pending]: (state, action) => {
      state.isUploading = true;
    },
    [createNewSpot.rejected]: (state, action) => {
      state.isUploading = false;
      state.errors = action.payload;
    },
    [createNewSpot.fulfilled]: (state, action) => {
      state.isUploading = false;
      state.uploadPercentage = null;
      state.uploaded = action.payload;
      state.errors = null;
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
    [getPostById.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
    },
    [getPostById.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.postById = action.payload;
    },
    [getPostById.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
    },
    [getSpotById.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
    },
    [getSpotById.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.spotById = action.payload;
    },
    [getSpotById.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
    },
    [getPostsByUser.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
      state.uploaded = false;
    },
    [getPostsByUser.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.postsByUser = action.payload;
    },
    [getPostsByUser.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
    },
    [getSpotsByUser.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
      state.uploaded = false;
    },
    [getSpotsByUser.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.spotsByUser = action.payload;
    },
    [getSpotsByUser.rejected]: (state, action) => {
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
    },
    [getAllSpotsByRegion.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
    },
    [getAllSpotsByRegion.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.spotsByLocation = action.payload;
    },
    [getAllSpotsByRegion.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
    },
    [likePost.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
    },
    [likePost.fulfilled]: (state, action) => {
      state.isFetching = false;

      const {liked, postId, page} = action.payload;

      if (page === "Details") {
        let tempPostElement = {...state.postById};

        if (liked) {
          const {owner} = action.payload;
          tempPostElement.likes.push({owner});
          state.postById = tempPostElement;
        } else {
          const {uid} = action.payload;
          tempPostElement.likes = tempPostElement.likes.filter(
            (like) => like.owner.uid !== uid,
          );
          state.postById = tempPostElement;
        }
      } else {
        let indexPostElement;

        if (page === "Explore") {
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
      }
    },
    [likePost.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = null;
    },
    [likeSpot.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
    },
    [likeSpot.fulfilled]: (state, action) => {
      state.isFetching = false;

      const {liked} = action.payload;
      let tempSpotElement = {...state.spotById};

      if (liked) {
        const {owner} = action.payload;
        tempSpotElement.likes.push({owner});
        state.spotById = tempSpotElement;
      } else {
        const {uid} = action.payload;
        tempSpotElement.likes = tempSpotElement.likes.filter(
          (like) => like.owner.uid !== uid,
        );
        state.spotById = tempSpotElement;
      }
    },
    [likeSpot.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = null;
    },
    [reactPost.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
    },
    [reactPost.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.errors = null;
    },
    [reactPost.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
    },
  },
});

export const {
  resetCreateErrors,
  reset,
  updateComments,
  updateCommentsSpot,
} = postSlice.actions;
export default postSlice.reducer;
