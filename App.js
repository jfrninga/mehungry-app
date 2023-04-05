import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/views/Login';
import Register from './src/views/Register';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import Home from './src/screens/Home'
import connectStore from './src/store/connectStore';
import Place from './src/views/Place';
import Places from './src/views/Places';

async function getValueFor(key) {
  return await SecureStore.getItemAsync(key)
}


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

const Stack = createStackNavigator();

function App() {

  const { connected, setConnected, setDisconnected } = connectStore(); // un Hook pour recupere les valeurs

  useEffect(() => {
    async function checkToken() {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        setConnected(false);
      } else {
        setConnected(true);
      }

      checkToken();
    } [connected]
  });

  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {connected && (
              <>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Places" component={Places} />
                <Stack.Screen name="Place" component={Place} />
              </>
            )}
            {!connected && (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
              </>
            )}
          </Stack.Navigator>
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
