import React from 'react';
import {StyleSheet, View, TextInput, Text} from 'react-native';

function TextBox({
  style,
  placeholder,
  onChangeText,
  textColor,
  placeholderTextColor,
  errors,
}) {
  let marginBottom = errors ? 0 : 20;

  return (
    <>
      <View style={[styles.container, style, {marginBottom}]}>
        <TextInput
          placeholder={placeholder}
          style={[styles.inputStyle, {color: textColor}]}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText}
        />
      </View>
      {errors && <Text style={styles.errorMessage}>{errors}</Text>}
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
    alignSelf: 'flex-start',
  },
});

export default TextBox;
