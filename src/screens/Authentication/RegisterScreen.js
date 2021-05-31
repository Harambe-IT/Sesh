import React, {memo} from "react";
import {
  ImageBackground,
  Image,
  View,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {useDispatch, useSelector} from "react-redux";
import {Button, Feedback, TextBox} from "../../components/Common";
import {
  signInFacebook,
  signInGoogle,
  signUp,
} from "../../features/authentication/authenticationSlice";
import styles from "./AuthenticationStyles";

const windowHeight = Dimensions.get("window").height;

const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();
  const {signUpErrors} = useSelector((state) => state.auth);

  const handleRegister = () => {
    dispatch(signUp({email, password, username}));
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
      <ScrollView>
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
          {signUpErrors && <Feedback error={signUpErrors} />}
          <TextBox
            placeholder="Username"
            placeholderTextColor="rgba(250, 250, 250, 0.75)"
            onChangeText={setUsername}
            style={styles.textBox}
          />
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
          <Button
            style={styles.loginButton}
            onPress={handleRegister}
            text="Register"
          />
          <View
            style={[
              styles.row,
              {
                justifyContent: "space-between",
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
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.navigationalLinkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </ImageBackground>
  );
};

export default memo(RegisterScreen);
