import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {
  signIn,
  signInFacebook,
  signInGoogle,
} from '../../features/authentication/authenticationSlice';

import PasswordTextBox from '../../components/Design/PasswordTextBox';
import TextBox from '../../components/Design/TextBox';
import CupertinoButtonDanger from '../../components/Design/CupertinoButtonDanger';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/image_InBb.png')}
        resizeMode="contain"
        style={styles.image}
        imageStyle={styles.image_imageStyle}>
        <Image
          source={require('../../assets/images/image_iWBB.png')}
          resizeMode="contain"
          style={styles.image2}></Image>
        <View style={styles.loremIpsumRow}>
          <Text style={styles.loremIpsum}>Sesh {'\n'}With</Text>
          <Text style={styles.loremIpsum1}>everywhere.{'\n'}everyone.</Text>
        </View>

        <View style={styles.form}>
          <View>
            <TextBox
              style={styles.EmailTextBox}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="white"
              textColor="black"></TextBox>
          </View>

          <View style={{marginTop: 32}}>
            <PasswordTextBox
              style={styles.PasswordTextBox}
              onChangeText={setPassword}
              errors={loginErrors}
            />
          </View>
        </View>

        <View style={styles.row}>
          <CupertinoButtonDanger
            style={styles.cupertinoButtonDanger}
            onPress={handleLogin}
            text="Login"
          />
          <CupertinoButtonDanger
            style={styles.cupertinoButtonDanger}
            onPress={() => navigation.navigate('Register')}
            text="Register"
          />
        </View>

        <View style={styles.image5Row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.socialButton, {left: -3}]}
            onPress={() => handleFacebookLogin()}>
            <Image
              source={require('../../assets/images/icon_facebook.png')}
              resizeMode="contain"
              style={styles.socialImage}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.socialButton, {left: 100}]}
            onPress={() => handleGoogleLogin()}>
            <Image
              source={require('../../assets/images/icon_google.png')}
              resizeMode="contain"
              style={styles.socialImage}></Image>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  errorMessage: {
    marginLeft: 100,
  },
  row: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
  image: {
    height: 1322,
    width: 556,
    marginTop: -247,
    marginLeft: -91,
  },
  image2: {
    height: 128,
    width: 128,
    marginTop: 270,
    marginLeft: 220,
  },
  loremIpsum: {
    fontFamily: 'roboto-700',
    color: 'rgba(255,255,255,1)',
    fontSize: 33,
    width: 81,
    height: 78,
  },
  loremIpsum1: {
    fontFamily: 'roboto-700',
    color: 'rgba(255,0,31,1)',
    fontSize: 33,
  },
  loremIpsumRow: {
    height: 80,
    flexDirection: 'row',
    marginLeft: 190,
    marginRight: 141,
  },
  EmailTextBox: {
    height: 50,
    width: 159,
    marginTop: 80,
    marginLeft: 210,
  },
  PasswordTextBox: {
    height: 50,
    width: 159,
    marginTop: 10,
    marginLeft: 210,
  },
  cupertinoButtonDanger: {
    height: 40,
    width: 100,
    marginTop: 5,
  },
  socialImage: {
    width: 54,
    height: 54,
  },
  image5Row: {
    height: 54,
    flexDirection: 'row',
    marginTop: 55,
    marginLeft: 214,
    marginRight: 213,
  },
  socialButton: {
    position: 'absolute',
    top: -45,
  },
});
