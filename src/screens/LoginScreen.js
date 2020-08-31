import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
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
    <View style={styles.container}>
      <Text style={styles.greeting}>{`Social App\nWelcome back!`}</Text>
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
        <Text style={{color: '#fff', fontWeight: '500'}}>Sign in</Text>
      </TouchableOpacity>

      <Button title="Facebook Sign-In" onPress={() => handleFacebookLogin()} />

      <Button title="Google Sign-In" onPress={() => handleGoogleLogin()} />

      <TouchableOpacity
        style={{alignSelf: 'center', marginTop: 32}}
        onPress={() => navigation.navigate('Register')}>
        <Text style={{color: '#414959', fontSize: 13}}>
          New to Social App?{' '}
          <Text style={{fontWeight: '500', color: '#e9446a'}}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: '#e9446a',
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
