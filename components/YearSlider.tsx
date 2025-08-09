import React, {useState, useRef} from 'react';
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

    //handle buffer debounce
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clamp = (val: number) => Math.min(Math.max(val, startYear), endYear);
    const handleValueChange = (val: number) => {
        const rounded = Math.round(clamp(val));
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            onYearChange(rounded);
        }, 30);
    }

    const handleSliding = (val: number) => {
        const rounded = Math.round(clamp(val));
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
            debounceTimeout.current = null;
        }
        onYearChange(rounded);
    }

    return (
        <View style={styles.container}>
            <Slider
                style={styles.slider}
                minimumValue={startYear}
                maximumValue={endYear}
                step={1}
                value={currentYear}
                onValueChange={handleValueChange}
                onSlidingComplete={handleSliding}
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