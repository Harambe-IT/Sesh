import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

import {AuthContext} from './src/store/Context';
import LoginReducer from './src/store/LoginReducer';

import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

const App = () => {
  const initialLoginState = {
    isLoading: true,
    user: null,
    loginError: null,
    registerError: null,
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
              dispatch({type: 'LOGIN_ERROR', errorMessage: error.message});
            });
        } else {
          dispatch({
            type: 'LOGIN_ERROR',
            errorMessage: 'Please fill in your email and password.',
          });
        }
      },
      signInFacebook: async () => {
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
          async (result) => {
            if (result.isCancelled) {
              dispatch({
                type: 'LOGIN_ERROR',
                errorMessage: 'User canceled facebook login process.',
              });
            }

            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
              dispatch({
                type: 'LOGIN_ERROR',
                errorMessage: 'Something went wrong obtaining access token.',
              });
            }
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
            return auth().signInWithCredential(facebookCredential);
          },
        ).catch((err) => {
          dispatch({
            type: 'LOGIN_ERROR',
            errorMessage: err.message,
          });
        });
      },
      signUp: async (user) => {
        if (
          user.firstName !== '' &&
          user.lastName !== '' &&
          user.email !== '' &&
          user.password !== ''
        ) {
          auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then((result) => {
              let promise1 = result.user.updateProfile({
                displayName: `${user.firstName} ${user.lastName}`,
              });

              let promise2 = firestore()
                .collection('users')
                .doc(result.user.uid)
                .set({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
                  createdOn: firestore.FieldValue.serverTimestamp(),
                });

              return Promise.all(promise1, promise2);
            })
            .catch((err) => {
              dispatch({
                type: 'REGISTER_ERROR',
                errorMessage: err.message,
              });
            });
        } else {
          dispatch({
            type: 'REGISTER_ERROR',
            errorMessage: 'Make sure to fill in all the fields.',
          });
        }
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
          <HomeScreen />
        ) : (
          <Stack.Navigator>
            {console.log(loginState)}
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
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
