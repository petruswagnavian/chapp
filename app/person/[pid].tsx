import {StyleSheet, Text, View, Dimensions, ColorValue, ScrollView, Image, Pressable} from 'react-native'
import React, {useEffect, useState} from 'react'
import {useLocalSearchParams} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {all_persons} from "@/constants/persons_data";
import colors from "@/constants/colors"
import {lighten, darken} from "@/utils/colorUtils"
import TransferButton from "@/components/TransferButton";

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
    const [imgHeight, setImgHeight] = useState<number | undefined>();
    useEffect(() => {
        if (person?.imageUrl) {
            Image.getSize(person.imageUrl, (w, h) => {
                const targetWidth = infoScrollAreaWidth - scrollAreaPadding * 2.4;
                const scaledHeight = h * (targetWidth / w);
                setImgHeight(scaledHeight);
            })
        }
    }, [person?.imageUrl]);
    if (!person) {
        return (
            <View style={styles.container}>
                <Text>Error: no person found</Text>
            </View>
        )
    }

    const mainCamp = person.mainCamp ? person.mainCamp : person.camps[0];
    const mainCampId = mainCamp.toLowerCase().replace(/\s+/g,"_");
    const mainCampCaps = mainCamp.toUpperCase();
    const mainCampColor = colors.camp[mainCampId as keyof typeof colors.camp];

    const backgroundBase = colors.primary;
    const backgroundGradient = [lighten(backgroundBase, 0.2),
        backgroundBase, darken(backgroundBase, 0.2)] as [ColorValue, ColorValue, ...ColorValue[]]

    const sideGradient = [lighten(mainCampColor, 0.2), mainCampColor,
        darken(mainCampColor, 0.4)] as [ColorValue, ColorValue, ...ColorValue[]]

    const displayNameCaps = person.displayName.toUpperCase();

    const fromYear = person.fromApprox ? "~" + person.fromYear : person.fromYear;
    const toYear = person.toApprox ? "~" + person.toYear : person.toYear;

    return (
        <LinearGradient colors={backgroundGradient}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        style={styles.container}>
            <TransferButton style={styles.backButton}
                            functionName="back"
                            backgroundColor={colors.dark[300]}
                            pressedColor={colors.dark[200]}
                            showIcon={true}/>
            <TransferButton style={styles.mapButton}
                            functionName="map"
                            backgroundColor={colors.dark[300]}
                            pressedColor={colors.dark[200]}
                            showIcon={true}/>
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
            <View style={styles.displayNameBanner}>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.displayNameText}>{displayNameCaps}</Text>
            </View>
            <View style={styles.mainCampBanner}>
                <TransferButton style={styles.mainCampButton}
                                functionName="camp"
                                backgroundColor={mainCampColor}
                                pressedColor={lighten(mainCampColor, 0.3)}
                                showIcon={false}
                >
                    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.mainCampButtonText}>{mainCampCaps}</Text>
                </TransferButton>
            </View>
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
                    <Text style={styles.infoHeader}>
                        {person.displayName}{"\n"}({fromYear} – {toYear})
                    </Text>
                    <Image
                        source={{uri: person.imageUrl}}
                        style={[
                            styles.image,
                            imgHeight ? {height: imgHeight} : {height: infoScrollAreaWidth * 1.25},
                            {borderColor: '#000'}
                        ]}
                        resizeMode="cover"
                        onError={e => console.log("Image failed", e.nativeEvent.error)}
                    />
                    <View style={{flexDirection: "row", paddingTop: scrollAreaPadding}}>
                        <Text style={styles.infoLabel}>Born: </Text>
                        <Text style={styles.infoValue}>{fromYear} AD</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.infoLabel}>Died: </Text>
                        <Text style={styles.infoValue}>{toYear} AD</Text>
                    </View>

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
        borderWidth: 1
    },
    infoHeader: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'ArnoPro-Bold',
        fontSize: 16,
        lineHeight: 20
        //backgroundColor: '#777',
    },
    image: {
        flex: 1,
        width: infoScrollAreaWidth - (scrollAreaPadding * 2.4),
        //height: infoScrollAreaWidth * 1.25,
        //height: imgHeight,
        borderWidth: 8,
        //borderRadius: 8,
    },
    infoText: {
        flex: 1,
        textAlign: 'left',
        fontFamily: 'ArnoPro-Regular',
        fontSize: 20,
        backgroundColor: '#777'
    },
    infoLabel: {
        width: 60,
        fontFamily: 'ArnoPro-Bold',
        fontSize: 18,
    },
    infoValue: {
        flex: 1,
        fontFamily: 'ArnoPro-Regular',
        fontSize: 18,
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
    mapButton: {
        position: 'absolute',
        top: 0,
        height: screenHeight / 6,
        right: 0,
        width: rightBarWidth,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        zIndex: 5,
    },
    displayNameBanner: {
        position: 'absolute',
        top: 0,
        height: topBarHeight,
        left: leftBarWidth,
        width: textScrollAreaWidth,
        //backgroundColor: '#333',
        justifyContent: 'center',
        paddingTop: scrollAreaPadding,
        paddingLeft: scrollAreaPadding,
    },
    displayNameText: {
        flex: 1,
        textAlign: 'left',
        textAlignVertical: 'center', //android only?
        fontFamily: 'ArnoPro-Regular',
        fontSize: 200,
        //backgroundColor: '#555'
    },
    mainCampBanner: {
        position: 'absolute',
        top: 0,
        height: topBarHeight,
        left: leftBarWidth + textScrollAreaWidth,
        width: infoScrollAreaWidth,
        //backgroundColor: '#999',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',

    },
    mainCampButton: {
        height: topBarHeight * 0.7,
        width: infoScrollAreaWidth * 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    mainCampButtonText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center', //android only ?
        fontFamily: 'ArnoPro-Bold',
        fontSize: 25,
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
        top: screenHeight / 6,
        height: screenHeight - (screenHeight / 6),
        right: 0,
        width: rightBarWidth,
        borderLeftWidth: 3,
    }
})