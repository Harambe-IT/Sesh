import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import {googleClientID} from './src/config/keys';

import {AuthContext} from './src/store/Context';
import LoginReducer from './src/store/LoginReducer';

import LoadingScreen from './src/screens/Common/LoadingScreen';
import LoginScreen from './src/screens/Authentication/LoginScreen';
import RegisterScreen from './src/screens/Authentication/RegisterScreen';
import TabScreens from './src/components/Common/MainNavigationTabs';
import ResetPasswordScreen from './src/screens/Authentication/ResetPassword';

const Stack = createStackNavigator();

GoogleSignin.configure({
  webClientId: googleClientID,
});

const App = () => {
  const initialLoginState = {
    isLoading: true,
    user: null,
    loginError: null,
    registerError: null,
    resetPasswordError: null,
    resetPasswordConfirmation: null,
  };

  const [loginState, dispatch] = React.useReducer(
    LoginReducer,
    initialLoginState,
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password) => {
        if (email !== '' && password !== '') {
          await auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
              return dispatch({
                type: 'LOGIN_ERROR',
                errorMessage: error.message,
              });
            });
        } else {
          return dispatch({
            type: 'LOGIN_ERROR',
            errorMessage: 'Please fill in your email and password.',
          });
        }
      },
      signInFacebook: async () => {
        LoginManager.logInWithPermissions(['public_profile', 'email'])
          .then(async (result) => {
            if (result.isCancelled) {
              throw new Error('Canceled');
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
            return dispatch({
              type: 'LOGIN_ERROR',
              errorMessage: err.message,
            });
          });
      },
      signInGoogle: async () => {
        GoogleSignin.signIn()
          .then((result) => {
            const {idToken} = result;
            return (googleCredential = auth.GoogleAuthProvider.credential(
              idToken,
            ));
          })
          .then((googleCredential) => {
            return auth().signInWithCredential(googleCredential);
          })
          .then((userResult) => {
            console.log(userResult);
          })
          .catch((err) => {
            return dispatch({
              type: 'LOGIN_ERROR',
              errorMessage: err.message,
            });
          });
      },
      signUp: async (user) => {
        if (
          user.username.trim() !== '' &&
          user.email.trim() !== '' &&
          user.password.trim() !== ''
        ) {
          auth()
            .createUserWithEmailAndPassword(user.email.trim(), user.password)
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
              return dispatch({
                type: 'REGISTER_ERROR',
                errorMessage: err.message,
              });
            });
        } else {
          return dispatch({
            type: 'REGISTER_ERROR',
            errorMessage: 'Make sure to fill in all the fields.',
          });
        }
      },
      resetPassword: async (email) => {
        auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            return dispatch({
              type: 'PASSWORD_RESET_SUCCESSFUL',
              confirmation: `Email has been sent to ${email}`,
            });
          })
          .catch((err) => {
            return dispatch({
              type: 'PASSWORD_RESET_ERROR',
              errorMessage: err.message,
            });
          });
      },
    }),
    [],
  );

  const onAuthStateChanged = async (user) => {
    dispatch({type: 'AUTH_CHANGED', user});
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (loginState.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.user !== null ? (
          <TabScreens />
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen
              name="Login"
              children={(props) => (
                <LoginScreen {...props} errorMessage={loginState.loginError} />
              )}
            />
            <Stack.Screen
              name="Register"
              children={(props) => (
                <RegisterScreen
                  {...props}
                  errorMessage={loginState.registerError}
                />
              )}
            />
            <Stack.Screen
              name="Reset Password"
              children={(props) => (
                <ResetPasswordScreen
                  {...props}
                  errorMessage={loginState.resetPasswordError}
                  confirmation={loginState.resetPasswordConfirmation}
                />
              )}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
