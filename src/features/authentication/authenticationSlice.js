import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {LoginManager, AccessToken} from "react-native-fbsdk";
import {GoogleSignin} from "@react-native-community/google-signin";
import {googleClientID} from "../../config/keys";

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (creds, {rejectWithValue}) => {
    if (creds.email.trim() === "" || creds.password.trim() === "")
      return rejectWithValue("Please fill in your password and email");
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

export const signInFacebook = createAsyncThunk(
  "auth/signInFacebook",
  async (empty, {rejectWithValue}) => {
    return LoginManager.logInWithPermissions(["public_profile", "email"])
      .then((result) => {
        if (result.isCancelled) {
          throw rejectWithValue("User cancled operation.");
        }

        return AccessToken.getCurrentAccessToken();
      })
      .then((data) => {
        if (!data) {
          throw new Error("Something went wrong obtaining access token.");
        }

        const facebookCredential = auth.FacebookAuthProvider.credential(
          data.accessToken,
        );

        return auth().signInWithCredential(facebookCredential);
      })
      .then(async (userResult) => {
        const {user, additionalUserInfo} = userResult;

        if (additionalUserInfo.isNewUser) {
          await firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              createdOn: firestore.FieldValue.serverTimestamp(),
              initials: `${additionalUserInfo.profile.first_name[0]}${additionalUserInfo.profile.last_name[0]}`.toUpperCase(),
            });
        }

        return userResult;
      })
      .catch((err) => {
        rejectWithValue(err.message);
      });
  },
);

export const signInGoogle = createAsyncThunk(
  "auth/signInGoogle",
  async (empty, {rejectWithValue}) => {
    GoogleSignin.configure({
      webClientId: googleClientID,
    });

    return GoogleSignin.signIn()
      .then((result) => {
        const {idToken} = result;
        return (googleCredential = auth.GoogleAuthProvider.credential(idToken));
      })
      .then((googleCredential) => {
        return auth().signInWithCredential(googleCredential);
      })
      .then((userResult) => {
        console.log(userResult);
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (user, {rejectWithValue}) => {
    if (
      user.email.trim() === "" ||
      user.password.trim() === "" ||
      user.username.trim() === ""
    ) {
      return rejectWithValue("Please fill in a password, email and username.");
    }
    return auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        let promise1 = result.user.updateProfile({
          displayName: user.username,
        });

        let promise2 = firestore()
          .collection("users")
          .doc(result.user.uid)
          .set({
            createdOn: firestore.FieldValue.serverTimestamp(),
            username: user.username,
          });

        return Promise.all([promise1, promise2]);
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, {rejectWithValue}) => {
    if (email.trim() === "") {
      return rejectWithValue("Please fill in an email.");
    }

    return auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return `Email has been sent to ${email}`;
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const authChanged = createAsyncThunk(
  "auth/authChanged",
  async (user, {rejectWithValue}) => {
    let userData = {};

    let userProfileTask = firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (!doc.exists)
          throw new error(
            `User with id '${user.uid}' didn't exist in the firestore.`,
          );
        userData.uid = doc.id;
        userData.createdOn = doc.data().seconds;
        userData.username = doc.data().username;
      });

    let userFollowingTask = firestore()
      .collection("followers")
      .where("followedById", "==", user.uid)
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
        userData.following = following;
      });

    let userFollowedByTask = firestore()
      .collection("followers")
      .where("followedId", "==", user.uid)
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
        userData.followedBy = followedBy;
      });

    await Promise.all([
      userProfileTask,
      userFollowingTask,
      userFollowedByTask,
    ]).catch((err) => {
      return rejectWithValue(err.message);
    });

    return userData;
  },
);

const initialState = {
  isFetching: true,
  user: null,
  loginErrors: null,
  signUpErrors: null,
  resetPasswordErrors: null,
  resetPasswordConfirmation: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    reset: (state) => initialState,
    updateFollowing: (state, action) => {
      state.user = {...state.user, following: action.payload};
    },
  },
  extraReducers: {
    [signIn.pending]: (state, action) => {
      state.isFetching = true;
    },
    [signIn.rejected]: (state, action) => {
      state.isFetching = false;
      state.user = null;

      if (action.payload.includes("auth/invalid-email"))
        state.loginErrors =
          "The email address is not valid.\nProvide a valid email address when trying to login.";
      else if (action.payload.includes("auth/user-disabled"))
        state.loginErrors =
          "The account you're trying to login to is disabled.\nContact support for more information.";
      else if (action.payload.includes("auth/user-not-found"))
        state.loginErrors = "Email and/or password were incorrect.";
      else if (action.payload.includes("auth/wrong-password"))
        state.loginErrors = "Email and/or password were incorrect.";
      else state.loginErrors = action.payload;
    },
    [signUp.pending]: (state, action) => {
      state.isFetching = true;
    },
    [signUp.rejected]: (state, action) => {
      state.isFetching = false;
      state.user = null;

      if (action.payload.includes("auth/invalid-email"))
        state.signUpErrors =
          "The email address is not valid.\nProvide a valid email address when trying to login.";
      else if (action.payload.includes("auth/user-disabled"))
        state.signUpErrors =
          "The account you're trying to login to is disabled.\nContact support for more information.";
      else if (action.payload.includes("auth/user-not-found"))
        state.signUpErrors = "Email and/or password were incorrect.";
      else if (action.payload.includes("auth/wrong-password"))
        state.signUpErrors = "Email and/or password were incorrect.";
      else state.signUpErrors = action.payload;
    },
    [authChanged.pending]: (state, action) => {
      state.isFetching = true;
      state.user = null;
      state.loginErrors = null;
      state.signUpErrors = null;
      state.resetPasswordErrors = null;
      state.resetPasswordConfirmation = null;
    },
    [authChanged.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.user = action.payload;
    },
    [authChanged.rejected]: (state, action) => {
      state.isFetching = false;
    },
    [resetPassword.pending]: (state, action) => {
      state.isFetching = true;
      state.resetPasswordErrors = null;
      state.resetPasswordConfirmation = null;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.resetPasswordConfirmation = action.payload;
    },
    [resetPassword.rejected]: (state, action) => {
      state.isFetching = false;
      if (action.payload.includes("auth/invalid-email"))
        state.resetPasswordErrors =
          "The email address is not valid.\nProvide a valid email address when trying to reset your password.";
      else if (action.payload.includes("auth/user-not-found"))
        state.resetPasswordErrors = "No user found with that email address.";
      else state.resetPasswordErrors = action.payload;
    },
  },
});

export const {reset, updateFollowing} = authSlice.actions;
export default authSlice.reducer;
