import auth from "@react-native-firebase/auth";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import React, {useEffect} from "react";
import {StatusBar, View, Text} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import AuthenticatedNavigation from "./src/components/Common/MainNavigation";
import {
  authChanged,
  reset as resetAuth,
} from "./src/features/authentication/authenticationSlice";
import {reset as resetPosts} from "./src/features/posts/postSlice";
import {reset as resetProfile} from "./src/features/profile/profileSlice";
import LoginScreen from "./src/screens/Authentication/LoginScreen";
import RegisterScreen from "./src/screens/Authentication/RegisterScreen";
import ResetPasswordScreen from "./src/screens/Authentication/ResetPassword";
import LoadingScreen from "./src/screens/Common/LoadingScreen";

const Stack = createStackNavigator();

const App = () => {
  const {user, isFetching} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleAuthChange = async (user) => {
    if (!user) {
      dispatch(resetAuth());
      dispatch(resetPosts());
      dispatch(resetProfile());
    }
    dispatch(authChanged(user));
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(handleAuthChange);
    return subscriber;
  }, []);

  return (
    <>
      <StatusBar hidden />
      {isFetching ? (
        <LoadingScreen backgroundImage />
      ) : (
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
      )}
    </>
  );
};

export default App;
