import React from "react";
import {
  Dimensions,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";

const windowHeight = Dimensions.get("window").height;

export default LoadingScreen = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/image_InBb.png")}
      style={{minHeight: windowHeight}}>
      <KeyboardAvoidingView style={[styles.container, {flex: 1}]}>
        <View style={styles.catchPhraseContainer}>
          <Text style={styles.catchPhrase}>Loading...</Text>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  catchPhraseContainer: {
    flexDirection: "row",
    marginBottom: "5%",
  },
  catchPhrase: {
    fontFamily: "roboto-700",
    fontSize: 33,
    color: "red",
  },
});
