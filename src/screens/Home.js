import { Button, TouchableOpacity } from "react-native";
import { StyleSheet, View, Text } from "react-native";
import * as SecureStore from 'expo-secure-store';
import connectStore from "../store/connectStore";
import Places from "../views/Places";
import { ScrollView } from "react-native-gesture-handler";
import Place from "../views/Place";



export default function Home({ navigation }) {

    const { setDisconnected } = connectStore();

    async function handleLogout() { // Function to logout the user
        await SecureStore.deleteItemAsync('token'); // Delete the token
        setDisconnected(false); // Modifie the status of connexion for the user

    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.text}>Welcome to the App!</Text>
                <Button style={styles.buttonLogout} title="Places" onPress={() => navigation.navigate('Places')} />
                <Button style={styles.buttonLogout} title="Logout" onPress={handleLogout} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60
    },
    text: {
        color: "grey",
        fontSize: 23
    },
    buttonLogout: {
        backgroundColor: 'orange',
        padding: 10,
        width: 150,
        borderRadius: 5,
        alignSelf: 'center'
    },
    link: {
        color: 'white',
        backgroundColor: 'orange',
        padding: 10,
        width: 150,
        borderRadius: 5,
        fontSize: 18,
        marginVertical: 10,
        textAlign: 'center',
        marginTop: 50
    },
});
