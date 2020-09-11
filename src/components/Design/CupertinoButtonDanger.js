import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

function CupertinoButtonDanger(props) {
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={props.onPress}>
      <Text style={styles.logIn}>Log In</Text>
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
  logIn: {
    color: '#fff',
    fontSize: 17,
  },
});

export default CupertinoButtonDanger;
