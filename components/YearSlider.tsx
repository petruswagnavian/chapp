import React, {useRef, useState, useEffect} from 'react';
import {View, Dimensions, StyleSheet, LayoutChangeEvent} from 'react-native';
//import Slider from '@react-native-community/slider';
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withSpring
} from 'react-native-reanimated';
import colors from '@/constants/colors';
import {devNull} from "node:os";

const screenWidth = Dimensions.get('window').width;
const thumbSize = 30;

interface Props {
    startYear: number;
    endYear: number;
    currentYear: number;
    onYearChange: (year: number) => void;
}

const YearSlider =
    ({startYear, endYear, currentYear, onYearChange}: Props) => {

    const [trackWidth, setTrackWidth] = useState(0);
    const [latestYear, setLatestYear] = useState(currentYear);
    const range = endYear - startYear;
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const debouncedYear = useSharedValue(currentYear)

    useEffect(() => {
        if (trackWidth === 0) return;
        const clampedYear = Math.min(Math.max(currentYear, startYear), endYear);
        translateX.value = ((clampedYear - startYear) / range) * trackWidth;
    }, [currentYear, startYear, endYear, trackWidth]);

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            onYearChange(latestYear);
        }, 40); //debounce ms
        return () => clearTimeout(debounceTimeout);
    }, [latestYear]);

    const pan = Gesture.Pan()
        .onStart(() => {
            startX.value = translateX.value
        })
        .onUpdate((e) => {
            let newX = startX.value + e.translationX;
            if (trackWidth === 0) return;
            newX = Math.max(0, Math.min(trackWidth, newX));
            translateX.value = newX;

            const position = newX / trackWidth;
            const year = startYear + position * range;
            runOnJS(setLatestYear)(Math.round(year));
        })
        .onEnd(() => {
            if (trackWidth === 0) return;
            const position = translateX.value / trackWidth;
            const year = Math.round(startYear + position * range);
            const snappedPos = ((year - startYear) / range) * trackWidth;
            translateX.value = withSpring(snappedPos, {damping: 15});

            runOnJS(setLatestYear)(Math.round(year));
        });

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}]
    }))
    const onTrackLayout = (e: LayoutChangeEvent) => {
        const width = e.nativeEvent.layout.width;
        if (width !== trackWidth) {
            setTrackWidth(width);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.track} onLayout={onTrackLayout}>
                <GestureDetector gesture={pan}>
                    <Animated.View style={[styles.thumb, thumbStyle]} />
                </GestureDetector>
            </View>
        </View>
    )

    /*
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
                minimumTrackTintColor={colors.purp[200]}
                maximumTrackTintColor={colors.purp[300]}
                thumbTintColor={colors.purp[200]}
            />
        </View>
    )
     */
}

/*
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
        transform: [{scaleY: 2}, {scaleX: 2}],
    }
})

 */

const styles= StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: screenWidth / 10,
        right: screenWidth / 5,
        height: 15,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
    },
    track: {
        width: '90%',
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2
    },
    thumb: {
        position: 'absolute',
        width: 20,
        height: thumbSize,
        borderRadius: 10,
        backgroundColor: 'dodgerblue',
        top: '50%',
        marginTop: -0.5 * thumbSize
    }
})

export default YearSlider;