import React, {useState, useEffect, useCallback} from 'react';
import {Text, View, Dimensions, ColorValue, StyleSheet, Image} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useFonts} from 'expo-font';
import {useFocusEffect} from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';
import {lighten, darken} from "@/utils/colorUtils";
import {getRandomTitleScreenPersons} from "@/utils/randomPersons";
import colors from "@/constants/colors";
import TransferButton from "@/components/TransferButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function TitlePortrait({person, personWidth, mainHeight}: {
    person: ReturnType<typeof getRandomTitleScreenPersons>[number];
    personWidth: number;
    mainHeight: number;
}) {
    return (
        <View style={{
            width: personWidth,
            height: mainHeight,
            backgroundColor: colors.dark[300],
        }}>
            <Image
                source={
                    person?.imageUrl
                        ? { uri: person.imageUrl }
                        : require('../assets/images/default_person.png')
                }
                style={{
                    width: '100%',
                    height: '85%',
                }}
                resizeMode="cover"
            />

            <View style={{
                width: '100%',
                height: '15%',
                marginTop: 0,
                borderWidth: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    style={styles.portraitText}
                >
                    {person?.displayName.toUpperCase() ?? "UNKNOWN"}
                </Text>
            </View>
        </View>
    );
}

export default function Index() {
    useEffect(() => {
        NavigationBar.setVisibilityAsync('hidden');
    }, []);
    const [layout, setLayout] = useState<{width: number; height: number}>({
        width: screenWidth,
        height: screenHeight
    })
    useFocusEffect(
        useCallback(() => {
            setTitlePersons(getRandomTitleScreenPersons());
        }, [])
    );
    const [titlePersons, setTitlePersons] = useState(getRandomTitleScreenPersons);
    const [fontsLoaded] = useFonts({
        'ArnoPro-Regular': require('../assets/fonts/ArnoPro-Regular.otf'),
        'ArnoPro-Bold': require('../assets/fonts/ArnoPro-Bold.otf'),
    })
    if (!fontsLoaded) return null;
    const quoteHeight = layout.height / 8;
    const rightTitleWidth = layout.width / 3;
    const mainHeight = layout.height - quoteHeight;
    const leftPortraitAreaWidth = layout.width - rightTitleWidth;
    const dividerWidth = layout.width / 80;
    const personWidth = (leftPortraitAreaWidth - (3 * dividerWidth)) / 3;
    const backgroundBase = colors.primary;
    const backgroundGradient = [lighten(backgroundBase, 0.2),
        backgroundBase, darken(backgroundBase, 0.2)] as [ColorValue, ColorValue, ...ColorValue[]]
    return (
        <LinearGradient colors={backgroundGradient}
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 0}}
                        style={{flex: 1}}
                        onLayout={(e) => {
                            const {width, height} = e.nativeEvent.layout;
                            setLayout({width, height})
                        }}
        >
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: leftPortraitAreaWidth,
                    height: mainHeight,
                    flexDirection: 'row',
                }}
            >
                <TitlePortrait
                    person={titlePersons[0]}
                    personWidth={personWidth}
                    mainHeight={mainHeight}
                />
                <View style={{
                    width: dividerWidth,
                    height: mainHeight,
                    backgroundColor: darken(colors.dark[300])
                }}>
                </View>
                <TitlePortrait
                    person={titlePersons[1]}
                    personWidth={personWidth}
                    mainHeight={mainHeight}
                />
                <View style={{
                    width: dividerWidth,
                    height: mainHeight,
                    backgroundColor: darken(colors.dark[300])
                }}>
                </View>
                <TitlePortrait
                    person={titlePersons[2]}
                    personWidth={personWidth}
                    mainHeight={mainHeight}
                />
                <View style={{
                    width: dividerWidth,
                    height: mainHeight,
                    backgroundColor: darken(colors.dark[300])
                }}>
                </View>
            </View>
            <View style={{
                position: 'absolute',
                marginLeft: 2 * rightTitleWidth,
                width: rightTitleWidth,
                top: 0,
                height: layout.height - quoteHeight,
                //backgroundColor: '#000'
            }}>
                <View
                    style={{ //displayTitleBanner
                        flex: 1,
                        marginBottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#666'
                    }}
                >
                    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.displayTitleText}>
                        BEDE
                    </Text>
                </View>
                <TransferButton
                    style={{
                        flex: 1,
                        margin: quoteHeight,
                        backgroundColor: "#000",
                        zIndex: 100
                    }}
                    functionName="map"
                    backgroundColor={colors.dark[300]}
                    pressedColor={"#555"}
                >
                    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.mapButtonText}>Map</Text>
                </TransferButton>
            </View>
            <View style={{ //quote area
                position: 'absolute',
                width: layout.width,
                top: layout.height - quoteHeight,
                bottom: 0,
                backgroundColor: '#333'
            }}>
            </View>
        </LinearGradient>
  );
}

const styles = StyleSheet.create({
    displayTitleText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'ArnoPro-Regular',
        fontSize: 100,
        letterSpacing: 4,
        color: '#f3e7c9',
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    mapButtonText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center', //android only ?
        fontFamily: 'ArnoPro-Bold',
        fontSize: 25,
    },
    portraitColumn: {
        flex: 1,
        padding: 0,
    },
    portraitImage: {
        flex: 5,
        width: '100%',
        borderWidth: 4,
        borderColor: colors.dark[300],
    },
    portraitTextBox: {
        flex: 1,
        width: '100%',
        marginTop: 10,
        borderWidth: 0,
        borderColor: colors.dark[300],
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    portraitText: {
        fontFamily: 'ArnoPro-Regular',
        fontSize: 20,
        color: '#f3e7c9',
        textAlign: 'center',
        padding: 5
    }
})