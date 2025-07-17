import {StyleSheet, Text, View, Button, Dimensions} from 'react-native'
import React, {useState} from 'react'
import MapView, {PROVIDER_GOOGLE} from "react-native-maps"
import {Link} from "expo-router";
import mapThemes from './mapThemes'

const Mapper = () => {
    const [currentTheme, setCurrentTheme] = useState(mapThemes.apostolic)
    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={currentTheme}
                initialRegion={{
                    latitude: 33,
                    longitude: 20,
                    latitudeDelta: 30,
                    longitudeDelta: 30,
                }}
            />

            <View style={styles.apostolicWrapper}>
                <Button title="Apostolic" onPress={() => setCurrentTheme(mapThemes.apostolic)} />
            </View>
            <View style={styles.greatWrapper}>
                <Button title="Great Church" onPress={() => setCurrentTheme(mapThemes.great)} />
            </View>
        </View>
    )
}
export default Mapper

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    apostolicWrapper: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        zIndex: 1,
    },
    greatWrapper: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        zIndex: 1,
    }

})