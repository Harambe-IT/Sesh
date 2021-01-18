import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

const BackArrow = ({navigation, to, style, extraOnClickHandler}) => {
  const handleClick = () => {
    navigation.navigate(to);
    extraOnClickHandler();
  };

  return (
    <TouchableOpacity onPress={handleClick} style={style}>
      <Image
        source={require('../../assets/images/navigation/icon_backArrow.png')}
        style={styles.backArrow}
      />
    </TouchableOpacity>
  );
};

export default BackArrow;

const styles = StyleSheet.create({
  backArrow: {
    width: 40,
    height: 40,
  },
});
