import React from 'react';
import {View, Button, Text} from 'react-native';
import {useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const {user} = useSelector((state) => state.auth);
  return (
    <View>
      <Text>Profile Screen</Text>
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

export default ProfileScreen;
