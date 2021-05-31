import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";

export const getUserProfile = createAsyncThunk(
  "profile/getById",
  async (uid, {rejectWithValue}) => {
    let user = {};

    let userFollowingTask = firestore()
      .collection("followers")
      .where("followedById", "==", uid)
      .get()
      .then((snapshot) => {
        let following = [];
        snapshot.forEach((doc) => {
          following.push({
            docId: doc.id,
            ...doc.data(),
          });
        });

        return following;
      })
      .then((following) => {
        user.following = following;
      })
      .catch((err) => {
        return rejectWithValue(err);
      });

    let userFollowedByTask = firestore()
      .collection("followers")
      .where("followedId", "==", uid)
      .get()
      .then((snapshot) => {
        let followedBy = [];
        snapshot.forEach((doc) => {
          followedBy.push({
            docId: doc.id,
            ...doc.data(),
          });
        });

        return followedBy;
      })
      .then((followedBy) => {
        user.followedBy = followedBy;
      })
      .catch((err) => {
        return rejectWithValue(err);
      });

    let userDetailsTask = firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        return {
          uid: doc.id,
          ...doc.data(),
          createdOn: doc.data()?.createdOn.seconds,
        };
      })
      .then((userData) => {
        user = {...user, ...userData};
      })
      .catch((err) => {
        return rejectWithValue(err);
      });

    return Promise.all([userDetailsTask, userFollowedByTask, userFollowingTask])
      .then(() => {
        return user;
      })
      .catch((err) => {
        return rejectWithValue(err);
      });
  },
);

export const toggleFollow = createAsyncThunk(
  "profile/createFollow",
  async ({followedById, followedId}, {rejectWithValue}) => {
    return firestore()
      .collection("followers")
      .where("followedById", "==", followedById)
      .where("followedId", "==", followedId)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return firestore()
            .collection("followers")
            .add({followedById, followedId});
        } else {
          return snapshot.docs[0].ref.delete();
        }
      })
      .then((doc) => {
        return true;
      })
      .catch((err) => {
        return rejectWithValue(err);
      });
  },
);

const initialState = {
  isFetching: false,
  errors: null,
  user: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {reset: (state) => initialState},
  extraReducers: {
    [getUserProfile.pending]: (state, action) => {
      state.isFetching = true;
      state.errors = null;
      state.user = null;
    },
    [getUserProfile.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.user = action.payload;
    },
    [getUserProfile.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
    },
    [toggleFollow.pending]: (state, action) => {
      state.isFetching = true;
    },
    [toggleFollow.rejected]: (state, action) => {
      state.isFetching = false;
      state.errors = action.payload;
    },
    [toggleFollow.fulfilled]: (state, action) => {
      state.isFetching = false;
    },
  },
});

export const {reset} = profileSlice.actions;
export default profileSlice.reducer;
