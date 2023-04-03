import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Form, FormItem } from 'react-native-form-component'
import * as SecureStore from 'expo-secure-store'

const LOGIN_USER = gql`
  mutation loginUser($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`

export default function Login({ navigation }) {
  const [form, setForm] = useState({
    username: 'jfr',
    password: 'azerty1234',
  })

  const [login, { data, loading, error }] = useMutation(LOGIN_USER);

  if (loading) return <Text>Submitting...</Text>;
  if (error) return <Text style={{
    padding: 40,
  }}>Submission error! ${error.message}</Text>

  const handleLogin = async () => {
    try {
      console.log('form', form);
      const {data} = await login({
        variables: {
          input: {
            identifier: form.username,
            password: form.password,
            provider: 'local',
          }
        }
      });
      console.log(data)
      await SecureStore.setItemAsync('token', data.login.jwt);
      await SecureStore.setItemAsync('user', JSON.stringify(data.login.user));

      if (data) {
        Alert.alert('Success', 'You have successfully logged in');
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <Form onButtonPress={handleLogin} buttonStyle={styles.submitButton}>
        <FormItem
          label="Username"
          asterik
          isRequired
          value={form.username}
          onChangeText={(username) => setForm({
            ...form,
            username
          })}
          textInputStyle={styles.textInput}
        />
        <FormItem
          label="Password"
          asterik
          isRequired
          value={form.password}
          onChangeText={(password) => setForm({
            ...form,
            password
          })}
          textInputStyle={styles.textInput}
        />
      </Form>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },

  text: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center'
  },

  submitButton: {
    backgroundColor: 'orange',
    padding: 10,
    width: 150,
    borderRadius: 5,
    alignSelf: 'center'
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  label: {
    fontSize: 16,
  },

  asterisk: {
    color: 'red',
  },
});