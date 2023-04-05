import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { Form, FormItem } from 'react-native-form-component'
import * as SecureStore from 'expo-secure-store'


const REGISTER_USER = gql`
  mutation UserRegister($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      jwt
      user {
        username
      }
    }
  }
`

export default function Register({ navigation }) {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [register, { data, loading, error }] = useMutation(REGISTER_USER);

    if (loading) return <Text>Submitting...</Text>;
    if (error) return <Text style={{
        padding: 40,
    }}>Submission error! ${error.message}</Text>

    const handleRegister = async () => {
        try {
            if (form.password !== form.confirmPassword) {
                Alert.alert('Error', 'Passwords do not match');
                return;
            }
            console.log('form', form);
            const { data } = await register({
                variables: {
                    input: {
                        username: form.username,
                        password: form.password,
                        email: form.email,
                    }
                }
            });
            console.log(data)
            await SecureStore.setItemAsync('token', data.register.jwt);
            await SecureStore.setItemAsync('user', JSON.stringify(data.register.user));

            if (data) {
                Alert.alert('Success', 'You have successfully registered');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Register</Text>
            <Form onButtonPress={handleRegister} buttonStyle={styles.submitButton}>
                <FormItem
                    label={
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Username</Text>
                            <Text style={styles.asterisk}>{'*'}</Text>
                        </View>
                    }
                    isRequired
                    value={form.username}
                    onChangeText={(username) => setForm({
                        ...form,
                        username
                    })}
                    textInputStyle={styles.textInput}
                />
                <FormItem
                    label={
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.asterisk}>{'*'}</Text>
                        </View>
                    }
                    isRequired
                    value={form.email}
                    onChangeText={(email) => setForm({
                        ...form,
                        email
                    })}
                    textInputStyle={styles.textInput}
                />
                <FormItem
                    label={
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Password</Text>
                            <Text style={styles.asterisk}>{'*'}</Text>
                        </View>
                    }
                    isRequired
                    value={form.password}
                    onChangeText={(password) => setForm({
                        ...form,
                        password
                    })}
                    textInputStyle={styles.textInput}
                />
                <FormItem
                    label={
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <Text style={styles.asterisk}>{'*'}</Text>
                        </View>
                    }
                    isRequired
                    value={form.confirmPassword}
                    onChangeText={(confirmPassword) => setForm({
                        ...form,
                        confirmPassword
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
        padding: 5
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