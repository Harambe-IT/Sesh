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
import {resetPassword} from '../../features/authentication/authenticationSlice';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const dispatch = useDispatch();
  const {resetPasswordErrors, resetPasswordConfirmation} = useSelector(
    (state) => state.auth,
  );

  const handleResetPassword = () => {
    dispatch(resetPassword(email));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>
        Join the <Text style={styles.greetingRed}>sesh.</Text>
      </Text>
      {resetPasswordErrors && (
        <View style={styles.errorMessage}>
          (<Text style={styles.error}>{resetPasswordErrors}</Text>)
        </View>
      )}
      {resetPasswordConfirmation && (
        <View style={styles.errorMessage}>
          (<Text style={styles.confirmation}>{resetPasswordConfirmation}</Text>)
        </View>
      )}

      <View style={styles.form}>
        <View style={{marginTop: 32}}>
          <Text style={styles.inputTitle}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Send reset link</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Login</Text>
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
  confirmation: {
    color: 'green',
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
