import React from 'react-native';
import {View, Dimensions, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import colors from '@/constants/colors';

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
                minimumTrackTintColor={colors.dark[100]}
                maximumTrackTintColor={colors.dark[300]}
                thumbTintColor={colors.dark[100]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: screenWidth / 10,
        right: screenWidth / 5,
        alignItems: 'center',
        zIndex: 2
    },
    slider: {
        width: '50%',
        height: '100%',
        transform: [{scaleY: 2}, {scaleX: 2}]
    }
})

export default YearSlider;