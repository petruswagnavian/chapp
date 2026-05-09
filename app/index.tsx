import React, {useState, useEffect} from 'react';
import {Text, View, Dimensions, ColorValue, StyleSheet} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useFonts} from 'expo-font';
import { Link } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';
import {lighten, darken} from "@/utils/colorUtils";
import colors from "@/constants/colors";
import TransferButton from "@/components/TransferButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function Index() {
    useEffect(() => {
        NavigationBar.setVisibilityAsync('hidden');
    }, []);
    const [layout, setLayout] = useState<{width: number; height: number}>({
        width: screenWidth,
        height: screenHeight
    })
    const [fontsLoaded] = useFonts({
        'ArnoPro-Regular': require('../assets/fonts/ArnoPro-Regular.otf'),
        'ArnoPro-Bold': require('../assets/fonts/ArnoPro-Bold.otf'),
    })
    if (!fontsLoaded) return null;
    const rightTitleWidth = layout.width / 3;
    const personWidth = (2 * rightTitleWidth) / 3;
    const quoteHeight = layout.height / 8;
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
    }
})