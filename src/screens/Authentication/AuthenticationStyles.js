import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    textAlign: "center",
  },
  headerImage: {
    marginTop: "15%",
  },
  catchPhraseContainer: {
    flexDirection: "row",
    marginBottom: "5%",
  },
  catchPhrase: {
    fontFamily: "roboto-700",
    fontSize: 33,
  },
  textBox: {
    borderBottomWidth: 3,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderColor: "#fafafa",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: "5%",
    paddingVertical: "2%",
    width: "80%",
  },
  loginButton: {
    marginVertical: "2%",
    width: "80%",
  },
  row: {
    flexDirection: "row",
    width: "80%",
    paddingBottom: "5%",
  },
  socialImage: {
    width: 100,
    height: 100,
  },
  navigationalLinkText: {
    fontSize: 17,
    textDecorationLine: "underline",
  },
});

export default styles;
