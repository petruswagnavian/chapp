import {StyleSheet, Text, View, Dimensions, ColorValue, ScrollView, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useLocalSearchParams} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {all_persons} from "@/constants/persons_data";
import colors from "@/constants/colors";
import {lighten, darken} from "@/utils/colorUtils";
import TransferButton from "@/components/TransferButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Identity = () => {
    const [layout, setLayout] = useState<{ width: number; height: number }>({
        width: screenWidth,
        height: screenHeight,
    });
    const leftBarWidth = layout.width / 14;
    const rightBarWidth = layout.width / 14;
    const topBarHeight = layout.height / 6;
    const scrollAreaPadding = 8;
    const scrollAreaWidth = layout.width - leftBarWidth - rightBarWidth;
    const textScrollAreaWidth = scrollAreaWidth * 0.7;
    const infoScrollAreaWidth = scrollAreaWidth - textScrollAreaWidth;

    const {pid} = useLocalSearchParams();
    const person = all_persons.find(p => p.pid === pid);
    const [imgHeight, setImgHeight] = useState<number | undefined>();
    useEffect(() => {
        if (person?.imageUrl && infoScrollAreaWidth > 0) { //depends on person?.imageUrl and infoScrollAreaWidth
            Image.getSize(person.imageUrl, (w, h) => {
                const targetWidth = infoScrollAreaWidth - scrollAreaPadding * 2.4;
                const scaledHeight = h * (targetWidth / w);
                setImgHeight(scaledHeight);
            }, (error) => console.error("Failed to get image size", error));
        }
    }, [person?.imageUrl, infoScrollAreaWidth, scrollAreaPadding]);
    if (!person) {
        return (
            <View style={{flex: 1}}>
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
                        style={{flex: 1}}
                        onLayout={(e) => {
                            const {width, height} = e.nativeEvent.layout;
                            setLayout({width, height});
                        }}
        >
            <TransferButton style={{ //BACK BUTTON
                                position: 'absolute',
                                top: 0,
                                height: layout.height / 6,
                                left: 0,
                                width: leftBarWidth,
                                borderBottomWidth: 3,
                                borderRightWidth: 3,
                                zIndex: 5,
                            }}
                            functionName="back"
                            backgroundColor={colors.dark[300]}
                            pressedColor={colors.dark[200]}
                            showIcon={true}/>
            <TransferButton style={{ // MAP BUTTON
                                position: 'absolute',
                                top: 0,
                                height: layout.height / 6,
                                right: 0,
                                width: rightBarWidth,
                                borderBottomWidth: 3,
                                borderLeftWidth: 3,
                                zIndex: 5,
                            }}
                            functionName="map"
                            backgroundColor={colors.dark[300]}
                            pressedColor={colors.dark[200]}
                            showIcon={true}/>
            <LinearGradient colors={sideGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ //leftBanner
                                position: 'absolute',
                                top: layout.height / 6,
                                height: layout.height - (layout.height / 6),
                                left: 0,
                                width: leftBarWidth,
                                borderRightWidth: 3,
                            }}
            />
            <LinearGradient colors={sideGradient}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={{ //rightBanner
                                position: 'absolute',
                                top: layout.height / 6,
                                height: layout.height - (layout.height / 6),
                                right: 0,
                                width: rightBarWidth,
                                borderLeftWidth: 3
                            }}
            />
            <View
                style={{ //displayNameBanner
                    position: 'absolute',
                    top: 0,
                    height: topBarHeight,
                    left: leftBarWidth,
                    width: textScrollAreaWidth,
                    //backgroundColor: '#333',
                    justifyContent: 'center',
                    paddingTop: scrollAreaPadding,
                    paddingLeft: scrollAreaPadding,
                }}
            >
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.displayNameText}>{displayNameCaps}</Text>
            </View>
            <View
                style={{ //mainCampBanner
                    position: 'absolute',
                    top: 0,
                    height: topBarHeight,
                    left: leftBarWidth + textScrollAreaWidth,
                    width: infoScrollAreaWidth,
                    //backgroundColor: '#999',
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <TransferButton style={{ //mainCampButton
                                    height: topBarHeight * 0.7,
                                    width: infoScrollAreaWidth * 0.8,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                }}
                                functionName="camp"
                                backgroundColor={mainCampColor}
                                pressedColor={lighten(mainCampColor, 0.3)}
                                showIcon={false}
                >
                    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.mainCampButtonText}>{mainCampCaps}</Text>
                </TransferButton>
            </View>
            <View style={{
                flex: 1,
                flexDirection: "row",
                //backgroundColor: '#000'
                marginTop: topBarHeight,
                marginLeft: leftBarWidth,
                marginRight: rightBarWidth,
            }}>
                <ScrollView
                    style={{ //textScrollArea
                        width: textScrollAreaWidth
                        //marginLeft: 0,
                    }}
                    contentContainerStyle={{
                        padding: scrollAreaPadding
                    }}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={{ //bioBox
                        height: layout.height * 2,
                        backgroundColor: '#000'
                    }}
                    ></View>
                </ScrollView>
                <ScrollView
                    style={{ //infoScrollArea
                        //marginLeft: 0,
                        width: infoScrollAreaWidth,
                        borderWidth: 1
                    }}
                    contentContainerStyle={{ //scrollContent
                        padding: scrollAreaPadding
                    }}
                    showsVerticalScrollIndicator={true}
                >
                    <Text style={styles.infoHeader}>
                        {person.displayName}{"\n"}({fromYear} – {toYear})
                    </Text>
                    <Image
                        source={{uri: person.imageUrl}}
                        style={{
                            height: imgHeight ?? infoScrollAreaWidth * 1.5,
                            width: infoScrollAreaWidth - (scrollAreaPadding * 2.4),
                            //height: infoScrollAreaWidth * 1.25,
                            //height: imgHeight,
                            borderWidth: 8,
                            borderColor: '#000',
                            //borderRadius: 8,
                        }}
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

const styles = StyleSheet.create({
    infoHeader: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'ArnoPro-Bold',
        fontSize: 16,
        lineHeight: 20
        //backgroundColor: '#777',
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
    displayNameText: {
        flex: 1,
        textAlign: 'left',
        textAlignVertical: 'center', //android only?
        fontFamily: 'ArnoPro-Regular',
        fontSize: 200,
        //backgroundColor: '#555'
    },
    mainCampButtonText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center', //android only ?
        fontFamily: 'ArnoPro-Bold',
        fontSize: 25,
    }
})

export default Identity;