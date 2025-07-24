import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {Link} from "expo-router";
import mapThemes from '@/constants/mapThemes';
import HomeButton from '@/components/HomeButton';
import AgeSelector, {Age} from '@/components/AgeSelector';

const list_of_ages: Age[] =[
    {id: 'apostolic_age', label: 'Apostolic Age', startYear: 33, endYear: 179},
    {id: 'great_age', label: 'Great Church', startYear: 180, endYear: 324}
]

const Mapper = () => {
    const [selectedAge, setSelectedAge] = useState<Age>(list_of_ages[0])
    const [currentYear, setCurrentYear] = useState<number>(selectedAge.startYear)
    const [currentTheme, setCurrentTheme] = useState(mapThemes[list_of_ages[0].id]);
    const handleSelectAge = (age: Age) => {
        setSelectedAge(age);
        setCurrentYear(age.startYear);
        setCurrentTheme(mapThemes[age.id]);
    }
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
            <HomeButton />
            <AgeSelector
                ages={list_of_ages}
                selectedAgeId={selectedAge.id}
                onSelectAge={handleSelectAge}
            />
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
})