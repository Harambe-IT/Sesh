import React, {memo} from "react";
import {Text, StyleSheet, View} from "react-native";

const Error = ({error, containerStyle, textStyle}) => {
  return (
    <View style={[containerStyle, styles.container]}>
      {error.split("\n").map((err, i) => (
        <Text key={i} style={[styles.errorText, textStyle]}>
          {err}
        </Text>
      ))}
    </View>
  );
};

export default memo(Error);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 0, 0, 0.4)",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "white",
    fontStyle: "italic",
    marginLeft: "auto",
    marginRight: "auto",
  },
});
