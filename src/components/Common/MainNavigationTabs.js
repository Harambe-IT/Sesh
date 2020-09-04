import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ExploreScreen from '../../screens/Explore/ExploreScreen';
import DiscoverScreen from '../../screens/Discover/DiscoverScreen';
import ActivityScreen from '../../screens/Activity/ActivityScreen';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import CreateContentScreen from '../../screens/CreateContent/CreateContentScreen';

const Tab = createBottomTabNavigator();

const MainNavigationTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Create Content" component={CreateContentScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigationTabs;
