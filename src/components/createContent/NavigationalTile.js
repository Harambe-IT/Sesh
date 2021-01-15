import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

const NavigationalTile = ({image, title, routeName, navigation}) => {
  const handleClick = () => {
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleClick}>
        <Image source={image} style={styles.tileImage} />
        <Text styles={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavigationalTile;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginVertical: 25,
  },
  tileImage: {
    width: 100,
    height: 100,
  },
  text: {
    // TODO: Align text in middle of navigational tile
  },
});
