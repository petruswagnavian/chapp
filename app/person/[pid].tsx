import {StyleSheet, Text, View, Dimensions, ColorValue, ScrollView, Image} from 'react-native'
import React from 'react'
import {useLocalSearchParams} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import chroma from "chroma-js";
import {all_persons} from "@/constants/persons_data";
import colors from "@/constants/colors"
import BackButton from "@/components/BackButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const leftBarWidth = screenWidth / 14;
const rightBarWidth = screenWidth / 14;
const topBarHeight = screenHeight / 6;
const scrollAreaPadding = 8;
const scrollAreaWidth = screenWidth - leftBarWidth - rightBarWidth;
const textScrollAreaWidth = scrollAreaWidth * 0.7;
const infoScrollAreaWidth = scrollAreaWidth - textScrollAreaWidth;

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
    const backgroundBase = colors.dark[100];
    const backgroundGradient = [lighten(backgroundBase, 0.2),
        backgroundBase, darken(backgroundBase, 0.2)] as [ColorValue, ColorValue, ...ColorValue[]]
    const base = '#4A90E2';
    const sideGradient = [lighten(base, 0.2), base, darken(base, 0.4)
        ] as [ColorValue, ColorValue, ...ColorValue[]]
    return (
        <LinearGradient colors={backgroundGradient}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        style = {styles.container}>
            <BackButton style={styles.backButton}
                        backgroundColor={colors.dark[300]}
                        pressedColor={colors.dark[200]}/>
            <LinearGradient colors={sideGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.leftBanner}
            />
            <LinearGradient colors={sideGradient}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.rightBanner}
            />
            <View style={styles.nameBanner}></View>
            <View style={styles.campBanner}></View>
            <View style={styles.scrollArea}>
                <ScrollView style={styles.textScrollArea}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={true}
                >
                    <View style={styles.bioBox}></View>
                </ScrollView>
                <ScrollView style={styles.infoScrollArea}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={true}
                >
                    <View style={styles.infoBox}></View>
                    <Image
                        source={{uri: person.imageUrl}}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </ScrollView>
            </View>
        </LinearGradient>
    )
}

export default Identity

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollArea: {
        flex: 1,
        flexDirection: "row",
        marginTop: topBarHeight,
        marginLeft: leftBarWidth,
        marginRight: rightBarWidth,
        //backgroundColor: '#000'
    },
    textScrollArea: {
        //marginLeft: 0,
        width: textScrollAreaWidth,
    },
    bioBox: {
        height: screenHeight * 2,
        backgroundColor: '#000'
    },
    infoScrollArea: {
        //marginLeft: 0,
        width: infoScrollAreaWidth,
        borderWidth: 1,
    },
    infoBox: {
        height: screenHeight * 1.5,
        backgroundColor: '#777'
    },
    image: {
        width: infoScrollAreaWidth - (scrollAreaPadding * 2),
        height: infoScrollAreaWidth * 1.25,
    },
    scrollContent: {
        padding: scrollAreaPadding
    },
    backButton: {
        position: 'absolute',
        top: 0,
        height: screenHeight / 6,
        left: 0,
        width: leftBarWidth,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        zIndex: 5,
    },
    nameBanner: {
        position: 'absolute',
        top: 0,
        height: topBarHeight,
        left: leftBarWidth,
        width: textScrollAreaWidth,
        backgroundColor: '#333'
    },
    campBanner: {
        position: "absolute",
        top: 0,
        height: topBarHeight,
        left: leftBarWidth + textScrollAreaWidth,
        width: infoScrollAreaWidth,
        backgroundColor: '#999'
    },
    leftBanner: {
        position: 'absolute',
        top: screenHeight / 6,
        height: screenHeight - (screenHeight / 6),
        left: 0,
        width: leftBarWidth,
        borderRightWidth: 3,
    },
    rightBanner: {
        position: 'absolute',
        top: 0,
        height: screenHeight,
        right: 0,
        width: rightBarWidth,
        borderLeftWidth: 3,
    }

})