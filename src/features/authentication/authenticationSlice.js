import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import {googleClientID} from '../../config/keys';

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (creds, {rejectWithValue}) => {
    if (creds.email.trim() === '' || creds.password.trim() === '')
      return rejectWithValue('Please fill in your password and/or email');
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
  'auth/signInFacebook',
  async (empty, {rejectWithValue}) => {
    return LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          throw rejectWithValue('User cancled operation.');
        }

        return AccessToken.getCurrentAccessToken();
      })
      .then((data) => {
        if (!data) {
          throw new Error('Something went wrong obtaining access token.');
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
            .collection('users')
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
  'auth/signInGoogle',
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
  'auth/signUp',
  async (user, {rejectWithValue}) => {
    return auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        let promise1 = result.user.updateProfile({
          displayName: user.username,
        });

        let promise2 = firestore()
          .collection('users')
          .doc(result.user.uid)
          .set({
            initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
            createdOn: firestore.FieldValue.serverTimestamp(),
          });

        return Promise.all(promise1, promise2);
      })
      .catch((err) => {
        return rejectWithValue(err.message);
      });
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email, {rejectWithValue}) => {
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

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isFetching: true,
    user: null,
    loginErrors: null,
    signUpErrors: null,
    resetPasswordErrors: null,
    resetPasswordConfirmation: null,
  },
  reducers: {
    authChanged: (state, action) => {
      state.user = action.payload;
      state.isFetching = false;
      state.signupErrors = null;
      state.loginErrors = null;
      resetPasswordErrors = null;
    },
  },
  extraReducers: {
    [signIn.pending]: (state, action) => {
      state.isFetching = true;
    },
    [signIn.rejected]: (state, action) => {
      state.isFetching = false;
      state.user = null;
      state.loginErrors = action.payload;
    },
  },
});

export const {authChanged} = authSlice.actions;
export default authSlice.reducer;
