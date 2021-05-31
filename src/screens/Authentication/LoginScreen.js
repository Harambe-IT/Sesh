import React, {useState, memo} from "react";
import {
  ImageBackground,
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
import {Button, Feedback, TextBox} from "../../components/Common";
import styles from "./AuthenticationStyles";

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
      <KeyboardAvoidingView
        style={[styles.container, {maxHeight: windowHeight}]}>
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
        {loginErrors && <Feedback error={loginErrors} />}
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
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-between",
              marginTop: "20%",
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.socialButton}
            onPress={handleGoogleLogin}>
            <Image
              source={require("../../assets/images/icon_google.png")}
              style={styles.socialImage}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={handleFacebookLogin}>
            <Image
              source={require("../../assets/images/icon_facebook.png")}
              style={styles.socialImage}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-between",
            },
          ]}>
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
