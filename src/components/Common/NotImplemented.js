import React, {memo} from "react";
import {View, Text, StyleSheet} from "react-native";
import BackArrow from "../navigation/BackArrow";
import {useNavigation} from "@react-navigation/core";

const NotImplemented = () => {
  const navigation = useNavigation();

  return (
    <>
      <BackArrow navigation={navigation} to="Create" style={styles.backArrow} />
      <View style={styles.container}>
        <Text style={styles.text}>Coming soon!</Text>
        <Text style={styles.text}>This page hasn't been implemented yet.</Text>
      </View>
    </>
  );
};

export default memo(NotImplemented);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontFamily: "",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
});
