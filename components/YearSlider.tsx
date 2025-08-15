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

const screenWidth = Dimensions.get('window').width;
const lefty = screenWidth / 10;
const righty = screenWidth / 5;
const bufferWidth = screenWidth - lefty - righty; //aka containerWidth
const totalBufferOffset = bufferWidth * 0.05;
const leftZone = bufferWidth * 0.05; //from start of container to start of thumbTrack
const rightZone = bufferWidth * 0.95; //from start of container to end of thumbTrack
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
        const isDragging = useSharedValue(false);

        useEffect(() => {
            if (trackWidth === 0) return;
            const clampedYear = Math.min(Math.max(currentYear, startYear), endYear);
            translateX.value = ((clampedYear - startYear) / range) * trackWidth;
        }, [currentYear, startYear, endYear, trackWidth]);

        useEffect(() => {
            const debounceTimeout = setTimeout(() => {
                onYearChange(latestYear);
            }, 0); //debounce ms
            return () => clearTimeout(debounceTimeout);
        }, [latestYear]);

        const pan = Gesture.Pan()
            .onStart((e) => {
                isDragging.value = true;
                startX.value = translateX.value
                if (trackWidth === 0) return;
                /*
                const tapX = e.x;
                if (tapX <= leftZone) {
                    translateX.value = withSpring(0, {damping: 10, stiffness: 200});
                    runOnJS(setLatestYear)(startYear);
                } else if (tapX >= rightZone) {
                    translateX.value = withSpring(trackWidth, {damping: 10, stiffness: 200});
                    runOnJS(setLatestYear)(endYear);
                }
                 */
                //bring thumb to finger on first touch
                let newX = e.x - totalBufferOffset;
                newX = Math.max(0, Math.min(trackWidth, newX));
                const position = newX / trackWidth;
                const year = Math.round(startYear + position * range);
                const snappedPos = ((year - startYear) / range) * trackWidth;
                translateX.value = withSpring(snappedPos, {damping: 10, stiffness: 200});
                runOnJS(setLatestYear)(year);
                startX.value = newX;

            })
            .onUpdate((e) => {
                let newX = startX.value + e.translationX;
                if (trackWidth === 0) return;

                /*
                const tapX = e.x;
                if ((tapX <= leftZone) || (tapX >= rightZone)) {
                    return;
                }

                 */
                newX = Math.max(0, Math.min(trackWidth, newX));
                translateX.value = withSpring(newX, {damping: 10, stiffness: 200});

                const position = newX / trackWidth;
                const year = startYear + position * range;
                runOnJS(setLatestYear)(Math.round(year));
            })
            .onEnd(() => {
                isDragging.value = false;
                if (trackWidth === 0) return;
                const position = translateX.value / trackWidth;
                const year = Math.round(startYear + position * range);
                const snappedPos = ((year - startYear) / range) * trackWidth;
                translateX.value = withSpring(snappedPos, {damping: 10, stiffness: 200});

                runOnJS(setLatestYear)(Math.round(year));
            });
        const tap = Gesture.Tap()
            .onStart(() => {
                isDragging.value = true;
            })
            .onEnd((e) => {
                isDragging.value = false;
                if (trackWidth === 0) return;

                /*
                const tapX = e.x;
                if (tapX <= leftZone) {
                    translateX.value = withSpring(0, {damping: 10, stiffness: 200});
                    runOnJS(setLatestYear)(startYear);
                } else if (tapX >= rightZone) {
                    translateX.value = withSpring(trackWidth, {damping: 10, stiffness: 200});
                    runOnJS(setLatestYear)(endYear);
                }

                 */

                let newX = e.x - totalBufferOffset;
                newX = Math.max(0, Math.min(trackWidth, newX));
                const position = newX / trackWidth;
                const year = Math.round(startYear + position * range);
                const snappedPos = ((year - startYear) / range) * trackWidth;
                translateX.value = withSpring(snappedPos, {damping: 10, stiffness: 200});
                runOnJS(setLatestYear)(year);
            })

        const filledTrackStyle = useAnimatedStyle(() => {
            return {
                width: translateX.value + 30
            }
        })
        const thumbStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    {translateX: translateX.value},
                    {scale: withSpring(isDragging.value ? 1.3 : 1, {damping: 10, stiffness: 200})}
                ]
            }
        })
        const onTrackLayout = (e: LayoutChangeEvent) => {
            const width = e.nativeEvent.layout.width;
            if (width !== trackWidth) {
                setTrackWidth(width);
            }
        }
        const gestures = Gesture.Simultaneous(pan, tap);

        return (
            <GestureDetector gesture={gestures}>
                <View style={styles.container}>
                    <View style={styles.track}>
                        <Animated.View style={[styles.filledTrack, filledTrackStyle]}/>
                    </View>
                        <View style={styles.thumbTrack} onLayout={onTrackLayout}>
                            <Animated.View style={[styles.thumb, thumbStyle]}/>
                        </View>
                        <View style={styles.buffer}></View>
                </View>
            </GestureDetector>
        )
    }

const styles= StyleSheet.create({
    container: {
        position: 'absolute',
        left: lefty,
        right: righty,
        bottom: 0,
        height: 60,
        //backgroundColor: 'rgba(0,0,0,0.5)',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
    },
    thumbTrack: {
        position: 'absolute',
        width: bufferWidth * 0.90,
        height: '100%',
        //backgroundColor: 'rgba(0,0,0,0.5)',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    buffer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        //backgroundColor: 'rgba(0,0,0,0.5)',
        backgroundColor: 'transparent',
        zIndex: 5,
    },
    track: {
        position: 'absolute',
        width: '95%',
        height: 20,
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
        backgroundColor: '#ccc',
        zIndex: 1,
    },
    filledTrack: {
        height: '100%',
        backgroundColor: colors.purp[100],
        zIndex: 2,
    },
    thumb: {
        position: 'absolute',
        left: -thumbSize / 2 ,
        width: thumbSize,
        height: thumbSize,
        borderRadius: 10,
        backgroundColor: 'dodgerblue',
        top: '50%',
        marginTop: -0.5 * thumbSize,
        zIndex: 100
    }
})

export default YearSlider;