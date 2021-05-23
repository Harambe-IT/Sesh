import React, {memo} from "react";
import {Text, StyleSheet, View} from "react-native";

const Feedback = ({error, confirmation, containerStyle, textStyle}) => {
  return (
    <>
      {error ? (
        <View style={[containerStyle, styles.containerError]}>
          {error.split("\n").map((err, i) => (
            <Text key={i} style={[styles.text, textStyle]}>
              {err}
            </Text>
          ))}
        </View>
      ) : (
        <View style={[containerStyle, styles.containerConfirmation]}>
          {confirmation.split("\n").map((conf, i) => (
            <Text key={i} style={[styles.text, textStyle]}>
              {conf}
            </Text>
          ))}
        </View>
      )}
    </>
  );
};

export default memo(Feedback);

const styles = StyleSheet.create({
  containerError: {
    backgroundColor: "rgba(255, 0, 0, 0.4)",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  text: {
    color: "white",
    fontStyle: "italic",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  },
  containerConfirmation: {
    backgroundColor: "rgba(0, 255, 0, 0.4)",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
