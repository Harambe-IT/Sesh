import React, {memo} from "react";
import {StyleSheet, View, TextInput, Text} from "react-native";

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
