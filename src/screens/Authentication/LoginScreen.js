import React, {useState, memo, useEffect} from "react";
import {
  ImageBackground,
  StyleSheet,
  Image,
  View,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {
  signIn,
  signInFacebook,
  signInGoogle,
} from "../../features/authentication/authenticationSlice";
import {Button, Error, TextBox} from "../../components/Common";

const windowHeight = Dimensions.get("window").height;

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {loginErrors} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(signIn({email, password}));
  };

  const handleFacebookLogin = () => {
    dispatch(signInFacebook());
  };

  const handleGoogleLogin = () => {
    dispatch(signInGoogle());
  };

  return (
    <ImageBackground
      source={require("../../assets/images/image_InBb.png")}
      style={{minHeight: windowHeight}}>
      <KeyboardAvoidingView style={styles.container}>
        <Image
          style={styles.headerImage}
          source={require("../../assets/images/image_iWBB.png")}
        />
        <View style={styles.catchPhraseContainer}>
          <Text style={[styles.catchPhrase, {color: "rgb(255,255,255)"}]}>
            Sesh {"\n"}With
          </Text>
          <Text style={[styles.catchPhrase, {color: "rgb(255,0,31)"}]}>
            everywhere.{"\n"}everyone.
          </Text>
        </View>
        {loginErrors && <Error error={loginErrors} />}
        <TextBox
          placeholder="Email"
          placeholderTextColor="rgba(250, 250, 250, 0.75)"
          onChangeText={setEmail}
          style={styles.textBox}
          keyboardType="email-address"
        />
        <TextBox
          placeholder="Password"
          placeholderTextColor="rgba(250, 250, 250, 0.75)"
          onChangeText={setPassword}
          style={styles.textBox}
          password
        />
        <Button style={styles.loginButton} onPress={handleLogin} text="Login" />
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.socialButton}
            onPress={handleFacebookLogin}>
            <Image
              source={require("../../assets/images/icon_facebook.png")}
              style={[styles.socialImage, {marginRight: 40}]}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={handleGoogleLogin}>
            <Image
              source={require("../../assets/images/icon_google.png")}
              style={[styles.socialImage, {marginLeft: 40}]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Reset Password")}>
            <Text style={styles.navigationalLinkText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.navigationalLinkText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default memo(LoginScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    textAlign: "center",
  },
  headerImage: {
    marginTop: 15,
    marginBottom: 15,
  },
  catchPhraseContainer: {
    flexDirection: "row",
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
    marginTop: 15,
    paddingTop: 0,
    paddingBottom: 0,
    width: 200,
  },
  loginButton: {
    marginTop: 25,
    width: 200,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 25,
  },
  socialImage: {
    width: 60,
    height: 60,
  },
  navigationalLinkText: {
    marginHorizontal: 25,
    textDecorationLine: "underline",
  },
});

// const styles = StyleSheet.create({
//   cupertinoButtonDanger: {
//     height: 40,
//     width: 203,
//     marginTop: 5,
//     marginRight: "auto",
//     marginLeft: "auto",
//   },
//   socialImage: {
//     width: 54,
//     height: 54,
//   },
//   resetPasswordContainer: {
//     marginLeft: "auto",
//     marginRight: "auto",
//   },
//   resetPasswordText: {
//     textDecorationLine: "underline",
//   },
// });

//
//     <View style={styles.row}>
//       <TouchableOpacity
//         style={{marginLeft: "auto", marginRight: 25}}
//         onPress={() => navigation.navigate("Reset Password")}>
//         <Text style={styles.navigationalLinkText}>Reset Password</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={{marginRight: "auto", marginLeft: 45}}
//         onPress={() => navigation.navigate("Register")}>
//         <Text style={styles.navigationalLinkText}>Register</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </ImageBackground>
