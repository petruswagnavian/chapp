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
                maximumTrackTintColor={colors.dark[200]}
                thumbTintColor={colors.dark[100]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: screenWidth / 5,
        right: screenWidth / 5,
        alignItems: 'center'
    },
    slider: {
        width: '50%',
        height: '120%',
        transform: [{scaleY: 2}, {scaleX: 2}],
        backgroundColor: '#00000080'
    }
})

export default YearSlider;