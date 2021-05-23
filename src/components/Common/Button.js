import React, {memo} from "react";
import {StyleSheet, TouchableOpacity, Text} from "react-native";

const Button = ({style, onPress, text, disabled}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default memo(Button);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: "2%",
    borderRadius: 7,
  },
  text: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "",
  },
});
