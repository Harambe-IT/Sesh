import React from 'react';
import {View, Button, Text} from 'react-native';

import auth from '@react-native-firebase/auth';

const DiscoverScreen = () => {
  return (
    <View>
      <Text>Activity Screen</Text>
      <Button
        onPress={() => {
          auth().signOut();
        }}
        title="Logout"
        color="#841584"
        accessibilityLabel="Logout using this button"
      />
    </View>
  );
};

export default DiscoverScreen;
