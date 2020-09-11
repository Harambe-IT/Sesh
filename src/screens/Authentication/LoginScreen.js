import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import PasswordTextBox from '../../components/Design/PasswordTextBox';
import EmailTextBox from '../../components/Design/EmailTextBox';
import CupertinoButtonDanger from '../../components/Design/CupertinoButtonDanger';

import {AuthContext} from '../../store/Context';

const LoginScreen = ({navigation, errorMessage}) => {
  const [data, setData] = React.useState({
    email: '',
    password: '',
  });

  const [user, setUser] = React.useState(null);
  const [wachtwoord, setWachtwoord] = React.useState(null);

  const {signIn, signInFacebook, signInGoogle} = React.useContext(AuthContext);

  const handleLogin = () => {
    console.log(`signing in with user: ${user} password: ${wachtwoord}`);
    signIn(user, wachtwoord);
  };

  const handleFacebookLogin = () => {
    signInFacebook();
  };

  const handleGoogleLogin = () => {
    signInGoogle();
  };

  const handleFieldChange = (value) => {
    setData({
      ...data,
      ...value,
    });
  };

  const layout = (
    <ScrollView style={styles.container}>
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
            <EmailTextBox
              style={styles.EmailTextBox}
              onChangeText={(email) => {
                setUser(email);
              }}></EmailTextBox>
          </View>

          <View style={{marginTop: 32}}>
            <PasswordTextBox
              style={styles.PasswordTextBox}
              onChangeText={(wachtwoord) => {
                console.log(height);
                console.log(width);
                setWachtwoord(wachtwoord);
              }}></PasswordTextBox>
          </View>
        </View>

        <CupertinoButtonDanger
          style={styles.cupertinoButtonDanger}
          onPress={() => handleLogin()}></CupertinoButtonDanger>

        <View style={styles.image5Row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.button}
            onPress={() => handleFacebookLogin()}>
            <Image
              source={require('../../assets/images/facebook.png')}
              resizeMode="contain"
              style={styles.image5}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.button}
            onPress={() => handleGoogleLogin()}>
            <Image
              source={require('../../assets/images/search.png')}
              resizeMode="contain"
              style={styles.image4}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.errorMessage}>
          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        </View>
      </ImageBackground>
    </ScrollView>
  );

  var layout2 = (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>
        Sesh <Text style={styles.greetingRed}>everywhere.</Text>
      </Text>

      <Text style={styles.greeting}>
        With <Text style={styles.greetingRed}>everyone.</Text>
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleFacebookLogin()}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Facebook Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleGoogleLogin()}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Google Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Reset Password')}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Reset Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return layout;
};

export default LoginScreen;

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  errorMessage: {
    marginLeft: 100,
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
  image_imageStyle: {},
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
    width: 159,
    marginTop: 58,
    marginLeft: 210,
  },
  image5: {
    width: 54,
    height: 54,
  },
  image4: {
    width: 54,
    height: 54,
    marginLeft: 21,
  },
  image5Row: {
    height: 54,
    flexDirection: 'row',
    marginTop: 55,
    marginLeft: 214,
    marginRight: 213,
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  greetingRed: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: 'red',
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  error: {
    color: '#e9446a',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 39,
  },
  inputTitle: {
    color: '#8a8f9e',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  input: {
    borderBottomColor: '#8a8f9e',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: '#151f3d',
  },
  button: {
    marginHorizontal: 30,
    marginVertical: 10,
    backgroundColor: '#e9446a',
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
