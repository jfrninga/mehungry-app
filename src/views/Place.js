import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Form, FormItem } from "react-native-form-component";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native";
import { PLACES_QUERY } from "./Places";

const PLACE_QUERY = gql`
query($id: ID){
  place(id: $id) {
    data{
      id
      attributes{
        title
        address
        latitude
        longitude
      }
    }
  }
}
`

const POST_PLACE = gql`
mutation PostPlace($input: PlaceInput!) {
    createPlace(data: $input) {
        data {
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

const DELETE_MUTATION = gql`
mutation($id: ID!) {
  deletePlace(id: $id) {
    data {
      id
    }
  }
}
`


const UPDATE_MUTATION = gql`
mutation($id: ID!, $input: PlaceInput!) {
    updatePlace(id: $id, data: $input) {
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

export default function Place({ navigation, route }) {
    const [form, setForm] = useState({
        title: 'zfe-test2',
        address: 'fezf',
        latitude: '181.62',
        longitude: '198.566'
    })

    const { loading, error, data } = useQuery(PLACE_QUERY, {
        variables: { id: route.params.id },
    });

    const [postPlace] = useMutation(POST_PLACE, {
        refetchQueries: [
            { query: PLACES_QUERY }
        ],
        onCompleted: () => {
            // Reset form
            setForm({
                title: '',
                address: '',
                latitude: '',
                longitude: ''
            });
            alert('Place added successfully!');
        }
    });

    const handleSubmit = async () => {
        if (form.title === '' || form.address === '' || form.latitude === '' || form.longitude === '') return alert('Fields is required!')
        await postPlace({
            variables: {
                input: {
                    title: form.title,
                    address: form.address,
                    latitude: Number(form.latitude),
                    longitude: Number(form.longitude),
                    publishedAt: new Date() //date de création
                }
            }
        })
    }

    // Delete
    const [placeId, setPlaceId] = useState('');

    const [deletePlace] = useMutation(DELETE_MUTATION, {
        onCompleted: () => {
            // Reset form
            setPlaceId('');
            alert('Place deleted successfully!');
            navigation.goBack();
        },
        refetchQueries: [
            { query: PLACES_QUERY }
        ],
    });

    const handleDelete = () => {
        deletePlace({
            variables: {
                id: route.params.id,
            },
        });
    };

    // update
    const [updatePlace] = useMutation(UPDATE_MUTATION, {
        onCompleted: () => {
            // Reset form
            setPlaceId('');
            alert('Place updated successfully!');
            navigation.goBack();
        },
        refetchQueries: [
            { query: PLACES_QUERY }
        ],
    });

    const handleUpdate = () => {
        updatePlace({
            variables: {
                id: route.params.id,
                input: {
                    title: form.title,
                    address: form.address,
                    latitude: Number(form.latitude),
                    longitude: Number(form.longitude),
                }
            },
        });
    };


    return (
        <View style={styles.container}>
            {data && (
                <View style={styles.place} key={data.place.data.attributes.id}>
                    <Text>{data.place.data.attributes.title}</Text>
                    <Text>{data.place.data.attributes.address}</Text>
                    <View>
                        <Button
                            title="Delete"
                            onPress={handleDelete}
                        />
                        <Button
                            title="Update"
                            onPress={handleUpdate}
                        />
                    </View>
                </View>
            )}
            <Text style={styles.h1}>Add place</Text>
            <ScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                centerContent={true}
                style={{
                    width: '100%'
                }}
            >
                <View style={styles.content}>
                    <Form
                        onButtonPress={async () => await handleSubmit()}
                        buttonStyle={styles.submitButton}
                        style={styles.form}
                        buttonText={loading ? 'Loading...' : 'Add'}
                    >
                        <FormItem
                            label={
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Title</Text>
                                    <Text style={styles.asterisk}>{'*'}</Text>
                                </View>
                            }
                            isRequired
                            value={form.title}
                            onChangeText={(title) => setForm({
                                ...form,
                                title
                            })}
                            textInputStyle={styles.textInput}
                        />
                        <FormItem
                            label={
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Address</Text>
                                    <Text style={styles.asterisk}>{'*'}</Text>
                                </View>
                            }
                            isRequired
                            value={form.address}
                            onChangeText={(address) => setForm({
                                ...form,
                                address
                            })}
                            textInputStyle={styles.textInput}
                        />
                        <FormItem
                            label={
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Latitude</Text>
                                    <Text style={styles.asterisk}>{'*'}</Text>
                                </View>
                            }
                            isRequired
                            value={form.latitude}
                            onChangeText={(latitude) => setForm({
                                ...form,
                                latitude
                            })}
                            textInputStyle={styles.textInput}
                        />
                        <FormItem
                            label={
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Longitude</Text>
                                    <Text style={styles.asterisk}>{'*'}</Text>
                                </View>
                            }
                            isRequired
                            value={form.longitude}
                            onChangeText={(longitude) => setForm({
                                ...form,
                                longitude
                            })}
                            textInputStyle={styles.textInput}
                        />
                    </Form>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60
    },
    h1: {
        color: "grey",
        fontSize: 23
    },
    content: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    },
    submitButton: {
        backgroundColor: 'blue',
        width: '100%',
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    form: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        fontSize: 16,
    },
    asterisk: {
        color: 'red',
        fontSize: 16
    },
    place: {
        alignItems: "center",
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        width: 300,
        minHeight: 100
    },
})
