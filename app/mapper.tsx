import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {Link} from "expo-router";
import mapThemes from '@/constants/mapThemes';
import HomeButton from '@/components/HomeButton';
import AgeSelector, {Age} from '@/components/AgeSelector';
import YearDisplay from '@/components/YearDisplay';
import YearSlider from '@/components/YearSlider';

const list_of_ages: Age[] = [
    {id: 'apostolic_age', label: 'APOSTOLIC CHURCH', startYear: 33, endYear: 179},
    {id: 'great_age', label: 'GREAT CHURCH', startYear: 180, endYear: 324},
    {id: 'nicene_age', label: 'NICENO-ROMAN AGE', startYear: 325, endYear: 450},
    {id: 'chalcedon_age', label: 'CHALCEDONIAN AGE', startYear: 451, endYear: 786},
    {id: 'eastWest_age', label: 'EAST-WEST CONFLICT', startYear: 787, endYear: 1053},
    {id: 'highMiddle_age', label: 'HIGH MIDDLE AGES', startYear: 1054, endYear: 1301},
    {id: 'lateMiddle_age', label: 'LATE MIDDLE AGES', startYear: 1302, endYear: 1516},
    {id: 'reformation_age', label: 'REFORMATION', startYear: 1517, endYear: 1647},
    {id: 'westphalian_age', label: 'REVIVAL AND REASON', startYear: 1648, endYear: 1913},
    {id: 'modern_age', label: 'MODERN AGE', startYear: 1914, endYear: 2025},
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
    const initialRegion = {
        latitude: 40,
        longitude: 20,
        latitudeDelta: 30,
        longitudeDelta: 30
    }
    const [region, setRegion] = useState(initialRegion);
    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={currentTheme}
                rotateEnabled={false}
                pitchEnabled={false}
                maxZoomLevel={7}
                region={region}
                onRegionChangeComplete={setRegion}
            />
            <HomeButton />
            <YearDisplay year={currentYear} />
            <AgeSelector
                ages={list_of_ages}
                selectedAgeId={selectedAge.id}
                onSelectAge={handleSelectAge}
            />
            <YearSlider
                startYear={selectedAge.startYear}
                endYear={selectedAge.endYear}
                currentYear={currentYear}
                onYearChange={(year) => setCurrentYear(year)}
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