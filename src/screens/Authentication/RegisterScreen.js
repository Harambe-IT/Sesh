import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {
  signUp,
  signInFacebook,
  signInGoogle,
} from '../../features/authentication/authenticationSlice';

const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch();
  const {signUpErrors} = useSelector((state) => state.auth);

  const handleFacebookLogin = () => {
    dispatch(signInFacebook());
  };

  const handleGoogleLogin = () => {
    dispatch(signInGoogle());
  };

  const handleRegister = () => {
    dispatch(signUp({email, password, username}));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>
        Join the <Text style={styles.greetingRed}>sesh.</Text>
      </Text>
      {signUpErrors && (
        <View style={styles.errorMessage}>
          <Text style={styles.error}>{signUpErrors}</Text>
        </View>
      )}

      <View style={styles.form}>
        <View>
          <Text style={styles.inputTitle}>Username</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={setUsername}
          />
        </View>

        <View style={{marginTop: 32}}>
          <Text style={styles.inputTitle}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
        </View>

        <View style={{marginTop: 32}}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleFacebookLogin}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Facebook Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Google Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Reset Password')}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Reset Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;

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
    backgroundColor: '#e9446a',
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
