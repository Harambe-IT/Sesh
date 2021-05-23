import React, {memo} from "react";
import {StyleSheet, TextInput} from "react-native";

const TextBox = ({
  onChangeText,
  value,
  placeholder,
  style,
  password,
  placeholderTextColor,
  keyboardType = "default",
}) => {
  return (
    <TextInput
      style={[styles.textBox, style]}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={password}
      underlineColorAndroid="transparent"
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  textBox: {},
});

export default memo(TextBox);
