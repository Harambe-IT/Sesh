import React, {Component} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

function EmailTextBox(props) {
  return (
    <View style={[styles.container, props.style]}>
      <TextInput
        placeholder="Username"
        style={styles.inputStyle}
        placeholderTextColor="#FFFFFF"
        onChangeText={props.onChangeText}></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 3,
    borderColor: '#FFFFFF',
    //backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    fontFamily: 'Myriad Pro',
    color: '#000',
    paddingRight: 5,
    fontSize: 16,
    alignSelf: 'center',
    flex: 1,
    lineHeight: 16,
    paddingTop: 16,
    paddingBottom: 5,
  },
});

export default EmailTextBox;
