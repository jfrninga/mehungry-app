import { gql, useQuery } from "@apollo/client";
import { View } from "react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const PLACES_QUERY = gql`
query GetPlaces {
    places(pagination:{ limit: -1 }) {
        data {
            id
            attributes {
            title,
            address,
            latitude,
            longitude
            }
        }
    }
}
`

export default function Places({ navigation }) {
    const { loading, error, data } = useQuery(PLACES_QUERY);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error! ${error.message}</Text>;

    return (
        <View style={styles.container}>
            <Text style={StyleSheet.text}>List of Places</Text>
            <ScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                centerContent={true}
                style={{
                    width: '100%'
                }}>
                {data && data.places.data.map((place) => (
                    <TouchableOpacity key={place.id} onPress={() => navigation.navigate('Place', { id: place.id })}>
                        <View style={StyleSheet.places}>
                            <Text style={styles.place}>{place.attributes.title}</Text>
                            {/* <Text style={styles.place}>{place.attributes.address}</Text>
                            <Text style={styles.place}>{place.attributes.latitude}</Text>
                            <Text style={styles.place}>{place.attributes.longitude}</Text> */}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    text: {
        color: "grey",
        fontSize: 35,
        marginBottom: 10
    },
    places: {
        flexDirection: 'row', // Display items side by side
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10, // Add some space between each place
    },
    place: {
        color: "grey",
        fontSize: 15,
        marginHorizontal: 10,
    }
});






