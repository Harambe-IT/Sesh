import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

function CupertinoButtonDanger({style, onPress, text, disabled}) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 7,
    paddingLeft: 16,
    paddingRight: 16,
  },
  text: {
    color: '#fff',
    fontSize: 17,
  },
});

export default CupertinoButtonDanger;
