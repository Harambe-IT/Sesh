import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {
  signUp,
  signInFacebook,
  signInGoogle,
} from '../../features/authentication/authenticationSlice';

import TextBox from '../../components/Design/TextBox';
import CupertinoButtonDanger from '../../components/Design/CupertinoButtonDanger';

const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/image_InBb.png')}
        style={styles.backgroundImage}>
        <View style={styles.row}>
          <Image
            source={require('../../assets/images/image_iWBB.png')}
            style={styles.logoImage}
          />
        </View>
        <View style={[styles.row, {marginTop: -50}]}>
          <Text style={styles.catchPhraseWhite}>Sesh {'\n'}With</Text>
          <Text style={styles.catchPhraseRed}>everywhere.{'\n'}everyone.</Text>
        </View>
        <TextBox
          style={styles.textBox}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="white"
          textColor="white"
          isPassword={false}
        />
        <TextBox
          style={styles.textBox}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="white"
          textColor="white"
          isPassword={false}
        />
        <TextBox
          style={styles.textBox}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="white"
          textColor="white"
          isPassword={true}
          errors={signUpErrors}
        />

        <View style={styles.row}>
          <CupertinoButtonDanger
            style={styles.cupertinoButtonDanger}
            onPress={handleRegister}
            text="Register"
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.socialButton, {marginRight: 50, marginLeft: 'auto'}]}
            onPress={handleFacebookLogin}>
            <Image
              source={require('../../assets/images/icon_facebook.png')}
              style={styles.socialImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.socialButton, {marginLeft: 50, marginRight: 'auto'}]}
            onPress={handleGoogleLogin}>
            <Image
              source={require('../../assets/images/icon_google.png')}
              style={styles.socialImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={{marginLeft: 'auto', marginRight: 25}}
            onPress={() => navigation.navigate('Reset Password')}>
            <Text style={styles.navigationalLinkText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginRight: 'auto', marginLeft: 45}}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.navigationalLinkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  logoImage: {
    height: 150,
    width: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  catchPhraseWhite: {
    fontFamily: 'roboto-700',
    color: 'rgba(255,255,255,1)',
    fontSize: 33,
    marginLeft: 'auto',
  },
  catchPhraseRed: {
    fontFamily: 'roboto-700',
    color: 'rgba(255,0,31,1)',
    fontSize: 33,
    marginRight: 'auto',
  },
  textBox: {
    height: 50,
    width: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cupertinoButtonDanger: {
    height: 40,
    width: 203,
    marginTop: 5,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  socialImage: {
    width: 54,
    height: 54,
  },
  navigationalLinkText: {
    textDecorationLine: 'underline',
  },
});
