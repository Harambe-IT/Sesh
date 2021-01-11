import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {useSelector, useDispatch} from 'react-redux';
import {authChanged} from './src/features/authentication/authenticationSlice';
import auth from '@react-native-firebase/auth';

import LoadingScreen from './src/screens/Common/LoadingScreen';
import LoginScreen from './src/screens/Authentication/LoginScreen';
import RegisterScreen from './src/screens/Authentication/RegisterScreen';
import AuthenticatedNavigation from './src/components/Common/MainNavigation';
import ResetPasswordScreen from './src/screens/Authentication/ResetPassword';

const Stack = createStackNavigator();

const App = () => {
  const {user, isFetching} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleAuthChange = async (user) => {
    dispatch(authChanged(user));
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(handleAuthChange);
    return subscriber;
  }, []);

  if (isFetching) return <LoadingScreen />;
  return (
    <NavigationContainer>
      {user !== null ? (
        <AuthenticatedNavigation />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Login"
            children={(props) => <LoginScreen {...props} />}
          />
          <Stack.Screen
            name="Register"
            children={(props) => <RegisterScreen {...props} />}
          />
          <Stack.Screen
            name="Reset Password"
            children={(props) => <ResetPasswordScreen {...props} />}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
