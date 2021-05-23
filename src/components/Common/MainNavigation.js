import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import TabBarIcon from "../../components/navigation/TabBarIcon";
import ActivityScreen from "../../screens/Activity/ActivityScreen";
import CreationNavigationStack from "../../screens/CreateContent/CreationNavigationScreen";
import DiscoverScreen from "../../screens/Discover/DiscoverScreen";
import ExploreScreen from "../../screens/Explore/ExploreScreen";
import Conversations from "../../screens/Messages/Conversations";
import ProfileScreen from "../../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreens = () => {
  return (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={({route}) => ({
        tabBarLabel: "",
        tabBarIcon: ({focused}) => {
          return <TabBarIcon routeName={route.name} focused={focused} />;
        },
      })}>
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Create" component={CreationNavigationStack} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        component={TabScreens}
        options={({route}) => {
          let currentRouteName =
            getFocusedRouteNameFromRoute(route) ?? "Explore";
          return {headerTitle: currentRouteName};
        }}
      />
      <Stack.Screen name="Conversations" component={Conversations} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
