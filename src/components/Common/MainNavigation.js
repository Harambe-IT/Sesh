import React from 'react';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import ExploreScreen from '../../screens/Explore/ExploreScreen';
import DiscoverScreen from '../../screens/Discover/DiscoverScreen';
import ActivityScreen from '../../screens/Activity/ActivityScreen';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import CreateContentScreen from '../../screens/CreateContent/CreateContentScreen';
import Conversations from '../../screens/Messages/Conversations';
import Header from '../../components/Common/Header';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreens = () => {
  return (
    <Tab.Navigator initialRouteName="Explore">
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Create Content" component={CreateContentScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const MainNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerTitle: (props) => <Header {...props} />,
      }}>
      <Stack.Screen
        name="Tabs"
        component={TabScreens}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Explore';
          return {headerTitle: routeName};
        }}
      />
      <Stack.Screen name="Conversations" component={Conversations} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
