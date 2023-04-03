import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/views/Login';
import Register from './src/views/Register';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, ApolloProvider, createHttpLink, HttpLink, InMemoryCache } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';

async function getValueFor(key) {
  return await SecureStore.getItemAsync(key)
}

const Tab = createBottomTabNavigator();

const httpLink = createHttpLink({
  uri: 'https://digitalcampus.nerdy-bear.com/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getValueFor('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
              name="Login"
              component={Login}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="log-in-outline" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Register"
              component={Register}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-add-outline" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </ApolloProvider>
  );
}

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
