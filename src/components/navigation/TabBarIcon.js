import React from 'react';
import {Image, View, StyleSheet} from 'react-native';

const TabBarIcon = ({routeName, focused}) => {
  let icon;
  let color = focused ? 'red' : 'black';

  switch (routeName) {
    case 'Explore':
      icon = require('../../assets/images/navigation/icon_explore.png');
      break;
    case 'Discover':
      icon = require('../../assets/images/navigation/icon_discover.png');
      break;
    case 'Create Content':
      icon = require('../../assets/images/navigation/icon_createContent.png');
      break;
    case 'Activity':
      icon = require('../../assets/images/navigation/icon_notifications.png');
      break;
    case 'Profile':
      icon = require('../../assets/images/navigation/icon_profile.png');
      break;
    default:
      break;
  }

  return (
    <View style={styles.container}>
      <Image
        source={icon}
        style={
          routeName === 'Create Content'
            ? styles.tabIconLarge
            : [styles.tabIcon, {tintColor: color}]
        }
      />
    </View>
  );
};

export default TabBarIcon;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    padding: 5,
  },
  tabIcon: {
    width: 30,
    height: 30,
    resizeMode: 'center',
  },
  tabIconLarge: {
    width: 35,
    height: 35,
    resizeMode: 'center',
  },
});
