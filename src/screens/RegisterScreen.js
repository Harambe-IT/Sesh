import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {AuthContext} from '../store/Context';

const RegisterScreen = ({navigation, errorMessage}) => {
  const [data, setData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const {signUp} = React.useContext(AuthContext);

  const handleFieldChange = (value) => {
    setData({
      ...data,
      ...value,
    });
  };

  const handleLogin = () => {
    signUp(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>{`Social App\nWelcome back!`}</Text>
      <View style={styles.errorMessage}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.inputTitle}>First Name</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(firstName) => handleFieldChange({firstName})}
          />
        </View>

        <View style={{marginTop: 32}}>
          <Text style={styles.inputTitle}>Last Name</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(lastName) => handleFieldChange({lastName})}
          />
        </View>

        <View style={{marginTop: 32}}>
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={{color: '#fff', fontWeight: '500'}}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignSelf: 'center', marginTop: 32, marginBottom: 32}}
        onPress={() => navigation.navigate('Login')}>
        <Text style={{color: '#414959', fontSize: 13}}>
          Already have an account?{' '}
          <Text style={{fontWeight: '500', color: '#e9446a'}}>Log in</Text>
        </Text>
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
