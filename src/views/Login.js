import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Form, FormItem } from 'react-native-form-component'

export default function Login({ navigation }) {
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  return (
    <View  style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <Form onButtonPress={() => console.warn(form)} buttonStyle={styles.submitButton}>
        <FormItem
          label="username"
          isRequired
          value={form.username}
          onChangeText={(username) => setForm({
            ...form,
            username
          })}
          asterik
          textInputStyle={styles.textInput}
          />
        <FormItem
          label="password"
          isRequired
          value={form.password}
          onChangeText={(password) => setForm({
            ...form,
            password
          })}
          asterik
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
    padding: 10
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
});