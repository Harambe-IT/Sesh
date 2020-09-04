import React from 'react';
import {View, Text, TouchableOpacity, Header} from 'react-native';

const CustomHeader = ({route}) => {
  console.log(route);
  return (
    <View>
      <Text>test</Text>
      <TouchableOpacity /*onPress={() => navigation.navigate('Conversations')}*/
      >
        <Text>Messages</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
