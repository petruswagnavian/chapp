import React from 'react-native';
import {View, Dimensions, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';

const screenWidth = Dimensions.get('window').width;

interface Props {
    startYear: number;
    endYear: number;
    currentYear: number;
    onYearChange: (year: number) => void;
}

const YearSlider =
    ({startYear, endYear, currentYear, onYearChange}: Props) => {
    return (
        <View style={styles.container}>
            <Slider
                style={styles.slider}
                minimumValue={startYear}
                maximumValue={endYear}
                step={1}
                value={currentYear}
                onValueChange={onYearChange}
                minimumTrackTintColor='#fff'
                maximumTrackTintColor='#888'
                thumbTintColor='#fff'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        left: screenWidth / 5,
        right: screenWidth / 5,
        alignItems: 'center'
    },
    slider: {
        width: '100%',
        height: 40
    },
})

export default YearSlider;