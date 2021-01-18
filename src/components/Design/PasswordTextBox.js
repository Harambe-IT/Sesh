import React from 'react';
import {StyleSheet, View, TextInput, Text} from 'react-native';

function PasswordTextBox(props) {
  return (
    <>
      <View style={[styles.container, props.style]}>
        <TextInput
          placeholder="Password"
          style={styles.inputStyle}
          placeholderTextColor="#FFFFFF"
          onChangeText={props.onChangeText}
          secureTextEntry={true}></TextInput>
      </View>
      {props.errors && <Text style={styles.errorMessage}>{props.errors}</Text>}
    </>
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
    paddingRight: 5,
    fontSize: 16,
    alignSelf: 'center',
    flex: 1,
    lineHeight: 16,
    paddingTop: 16,
    paddingBottom: 5,
  },
  errorMessage: {
    color: 'red',
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default PasswordTextBox;
