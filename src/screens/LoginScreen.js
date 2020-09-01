import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {AuthContext} from '../store/Context';

const LoginScreen = ({navigation, errorMessage}) => {
  const [data, setData] = React.useState({
    email: '',
    password: '',
  });

  const {signIn, signInFacebook, signInGoogle} = React.useContext(AuthContext);

  const handleLogin = () => {
    signIn(data.email, data.password);
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>
        Sesh <Text style={styles.greetingRed}>everywhere.</Text>
      </Text>

      <Text style={styles.greeting}>
        With <Text style={styles.greetingRed}>everyone.</Text>
      </Text>

      <View style={styles.errorMessage}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.inputTitle}>Email Address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(email) => handleFieldChange({email})}
          />
        </View>

        <View style={{marginTop: 32}}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(password) => handleFieldChange({password})}
          />
        </View>
      </View>

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
        onPress={() => navigation.navigate('Register')}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Reset Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
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
