import {StyleSheet, Text, View, Dimensions, ColorValue} from 'react-native'
import React from 'react'
import {useLocalSearchParams} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import chroma from "chroma-js";
import {all_persons} from "@/constants/persons_data";
import colors from "@/constants/colors"
import BackButton from "@/components/BackButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Identity = () => {
    const { pid } = useLocalSearchParams();
    const person = all_persons.find(p => p.pid === pid);
    if (!person) {
        return (
            <View style={styles.container}>
                <Text>Error: no person found</Text>
            </View>
        )
    }
    function lighten(color: string, amount: number): string {
        return chroma.mix(color, "#fff", amount, "lab").hex();
    }
    function darken(color: string, amount: number): string {
        return chroma.mix(color, "#000", amount, "lab").hex();
    }
    const base = '#4A90E2';
    const sideGradient = [lighten(base, 0.2), base, darken(base, 0.4)
        ] as [ColorValue, ColorValue, ...ColorValue[]]

    return (
        <View style = {styles.container}>
            <Text>Person: {person.pid}</Text>
            <Text>{person.fromYear} - {person.toYear}</Text>
            <BackButton style={styles.backButton}
                        backgroundColor={colors.dark[300]}
                        pressedColor={colors.dark[200]}/>
            <LinearGradient colors={sideGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.leftBanner}
            />
        </View>
    )
}

export default Identity

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backButton: {
        position: 'absolute',
        top: 0,
        height: screenHeight / 6,
        left: 0,
        width: screenWidth / 12,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        zIndex: 5,
    },
    leftBanner: {
        position: 'absolute',
        top: screenHeight / 6,
        height: screenHeight - (screenHeight / 6),
        width: screenWidth / 12,
        borderRightWidth: 3,
    }

})