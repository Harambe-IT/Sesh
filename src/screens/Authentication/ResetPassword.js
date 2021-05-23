import React, {memo} from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Button, Feedback, TextBox} from "../../components/Common";
import {resetPassword} from "../../features/authentication/authenticationSlice";
import styles from "./AuthenticationStyles";

const windowHeight = Dimensions.get("window").height;

const ResetPassword = ({navigation}) => {
  const [email, setEmail] = React.useState("");
  const dispatch = useDispatch();
  const {resetPasswordErrors, resetPasswordConfirmation} = useSelector(
    (state) => state.auth,
  );

  const handleResetPassword = () => {
    dispatch(resetPassword(email));
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
        {resetPasswordErrors && <Feedback error={resetPasswordErrors} />}
        {resetPasswordConfirmation && (
          <Feedback confirmation={resetPasswordConfirmation} />
        )}
        <TextBox
          placeholder="Email"
          placeholderTextColor="rgba(250, 250, 250, 0.75)"
          onChangeText={setEmail}
          style={styles.textBox}
          keyboardType="email-address"
        />
        <Button
          style={styles.loginButton}
          onPress={handleResetPassword}
          text="Send reset link"
        />
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-between",
            },
          ]}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.navigationalLinkText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.navigationalLinkText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default memo(ResetPassword);
