import React, {useState, useEffect, useCallback} from 'react';
import {Text, View, Dimensions, ColorValue, StyleSheet, Image, ScrollView} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useFonts} from 'expo-font';
import {useFocusEffect} from "expo-router";
import { NavigationBar } from 'expo-navigation-bar';
import {Ionicons} from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import {lighten, darken} from "@/utils/colorUtils";
import {all_persons, Person} from "@/constants/persons_data";
import colors from "@/constants/colors";
import TransferButton from "@/components/TransferButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ink = darken(colors.dark[300], 0.7);
const cream = '#f3e7c9';
const portraitAspect = 0.667; //width / height - 4:5 is 0.8, 2:3 is 0.667
const figureBorderWidth = 3;

export type TitleQuote = {
    text: string;
    source: string;
}

//placeholder home - these belong on Person in persons_data once more are written
const titleQuotes: Record<string, TitleQuote> = {
    ignatius_of_antioch: {
        text: "I am the wheat of God, and let me be ground by the teeth of the wild beasts.",
        source: "Epistle to the Romans 4",
    },
    polycarp_of_smyrna: {
        text: "Eighty-six years I have served him, and he has done me no wrong.",
        source: "Martyrdom of Polycarp 9",
    },
    irenaeus_of_lyon: {
        text: "The glory of God is a living man, and the life of man consists in beholding God.",
        source: "Against Heresies IV.20.7",
    },
    cyprian_of_carthage: {
        text: "He cannot have God for his father who has not the Church for his mother.",
        source: "On the Unity of the Church 6",
    },
    athanasius_of_alexandria: {
        text: "He was made man that we might be made God.",
        source: "On the Incarnation 54",
    },
    gregory_of_nazianzus: {
        text: "That which he has not assumed he has not healed.",
        source: "Epistle 101",
    },
    jerome_of_stridon: {
        text: "Ignorance of the Scriptures is ignorance of Christ.",
        source: "Commentary on Isaiah, prologue",
    },
    john_chrysostom: {
        text: "Glory be to God for all things.",
        source: "Last words",
    },
    augustine_of_hippo: {
        text: "Thou hast made us for thyself, and our heart is restless until it rests in thee.",
        source: "Confessions I.1",
    },
}

function getRandomQuotedPerson(excludePid?: string): Person | null {
    const pool = all_persons.filter((person) => {
        const hasImage = person.imageUrl && person.imageUrl.trim().length > 0;
        const hasQuote = titleQuotes[person.pid] !== undefined;
        const isNotAlreadyShown = person.pid !== excludePid;

        return hasImage && hasQuote && isNotAlreadyShown;
    });

    if (pool.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}

function TitleFigure({person, columnWidth, columnHeight, portraitHeight}: {
    person: Person | null;
    columnWidth: number;
    columnHeight: number;
    portraitHeight: number;
}) {
    const quote = person ? titleQuotes[person.pid] : undefined;
    const fromYear = person?.fromApprox ? "~" + person.fromYear : person?.fromYear;
    const toYear = person?.toApprox ? "~" + person.toYear : person?.toYear;

    const imageUrl = person?.imageUrl?.trim() || undefined;
    const pictureWidth = columnWidth - figureBorderWidth;
    const [scaledHeight, setScaledHeight] = useState<number | undefined>();
    useEffect(() => {
        setScaledHeight(undefined); //the last person's height must not size this one
        if (imageUrl && pictureWidth > 0) {
            Image.getSize(imageUrl, (w, h) => {
                setScaledHeight(h * (pictureWidth / w));
            }, (error) => console.error("Failed to get image size", error));
        }
    }, [imageUrl, pictureWidth]);

    //taller than the frame means we show it from the top and scroll the rest,
    //shorter means we fall back to filling the frame and cropping the sides
    const isTall = scaledHeight !== undefined && scaledHeight > portraitHeight;
    const pictureHeight = isTall ? scaledHeight : portraitHeight;

    return (
        <View style={{
            width: columnWidth,
            height: columnHeight,
            backgroundColor: colors.dark[300],
            borderRightWidth: figureBorderWidth,
            borderColor: ink,
        }}>
            <View style={[styles.portraitFrame, {height: portraitHeight}]}>
                <ScrollView
                    key={person?.pid} //a new person starts back at the top
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={isTall}
                >
                    <Image
                        source={
                            imageUrl
                                ? { uri: imageUrl }
                                : require('../assets/images/default_person.png')
                        }
                        style={{
                            width: '100%',
                            height: pictureHeight,
                        }}
                        resizeMode="cover"
                    />
                </ScrollView>
            </View>

            <View style={styles.figureNameBox}>
                <Text
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    style={styles.figureNameText}
                >
                    {person?.displayName.toUpperCase() ?? "UNKNOWN"}
                </Text>
                {person && (
                    <Text numberOfLines={1} style={styles.figureDatesText}>
                        {fromYear} – {toYear}
                    </Text>
                )}
            </View>

            {quote && (
                <View style={styles.quoteBox}>
                    <View style={styles.quoteRule}/>
                    <View style={{flex: 1}}>
                        <Text
                            numberOfLines={4}
                            adjustsFontSizeToFit
                            style={styles.quoteText}
                        >
                            {"“" + quote.text + "”"}
                        </Text>
                        <Text numberOfLines={1} style={styles.quoteSourceText}>
                            {quote.source.toUpperCase()}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}

function UtilityButton({label, iconName}: {
    label: string;
    iconName: keyof typeof Ionicons.glyphMap;
}) {
    return (
        <TransferButton
            style={styles.utilityButton}
            onPress={() => {}} //no route yet
            backgroundColor="transparent"
            pressedColor="rgba(0,0,0,0.08)"
        >
            <Ionicons name={iconName} size={16} color={ink}/>
            <Text numberOfLines={1} style={styles.utilityText}>
                {label}
            </Text>
        </TransferButton>
    );
}

export default function Index() {
    useEffect(() => {
        NavigationBar.setHidden(true);
    }, []);
    const [layout, setLayout] = useState<{width: number; height: number}>({
        width: screenWidth,
        height: screenHeight
    })
    useFocusEffect(
        useCallback(() => {
            setTitlePerson(getRandomQuotedPerson());
        }, [])
    );
    const [titlePerson, setTitlePerson] = useState(getRandomQuotedPerson);
    const [fontsLoaded] = useFonts({
        'ArnoPro-Regular': require('../assets/fonts/ArnoPro-Regular.otf'),
        'ArnoPro-Bold': require('../assets/fonts/ArnoPro-Bold.otf'),
        'ArnoPro-Italic': require('../assets/fonts/ArnoPro-Italic.otf'),
    })
    if (!fontsLoaded) return null;
    const figureWidth = layout.width * 0.25;
    const portraitHeight = Math.min(figureWidth / portraitAspect, layout.height * 0.64);
    const pillarWidth = layout.width / 14;
    const panelPadding = layout.width / 34;
    const titleFontSize = layout.height / 5;
    const subtitleFontSize = layout.height / 16;
    const backgroundBase = colors.primary;
    const backgroundGradient = [lighten(backgroundBase, 0.2),
        backgroundBase, darken(backgroundBase, 0.2)] as [ColorValue, ColorValue, ...ColorValue[]]

    const mainCamp = titlePerson?.mainCamp ? titlePerson.mainCamp : titlePerson?.camps[0];
    const mainCampId = mainCamp?.replace(/\*/g, "").toLowerCase().replace(/\s+/g,"_");
    const mainCampColor = (mainCampId && colors.camp[mainCampId as keyof typeof colors.camp])
        || colors.dark[300];
    const pillarGradient = [lighten(mainCampColor, 0.2), mainCampColor,
        darken(mainCampColor, 0.4)] as [ColorValue, ColorValue, ...ColorValue[]]
    return (
        <LinearGradient colors={backgroundGradient}
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 0}}
                        style={{flex: 1, flexDirection: 'row'}}
                        onLayout={(e) => {
                            const {width, height} = e.nativeEvent.layout;
                            setLayout({width, height})
                        }}
        >
            <TransferButton style={{ //QUOTE BUTTON
                                position: 'absolute',
                                top: 0,
                                height: layout.height / 6,
                                left: 0,
                                width: pillarWidth,
                                borderBottomWidth: 3,
                                borderRightWidth: 3,
                                zIndex: 5,
                            }}
                            onPress={() => setTitlePerson(getRandomQuotedPerson(titlePerson?.pid))}
                            backgroundColor={colors.dark[300]}
                            pressedColor={colors.dark[200]}
            >
                <Entypo name="quote" size={28} color="black"/>
            </TransferButton>
            <LinearGradient colors={pillarGradient}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={{ //leftPillar
                                width: pillarWidth,
                                height: layout.height,
                                borderRightWidth: 3,
                                borderColor: ink,
                            }}
            />
            <TitleFigure
                person={titlePerson}
                columnWidth={figureWidth}
                columnHeight={layout.height}
                portraitHeight={portraitHeight}
            />
            <View style={{ //right panel
                flex: 1,
                padding: panelPadding,
                justifyContent: 'space-between',
            }}>
                <View style={styles.mastheadRow}>
                    <View style={{flexShrink: 1}}>
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={[styles.displayTitleText, {fontSize: titleFontSize}]}
                        >
                            BEDE
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={[styles.subtitleText, {fontSize: subtitleFontSize}]}
                        >
                            ECCLESIASTICAL HISTORY
                        </Text>
                    </View>
                    <View style={styles.utilityRow}>
                        <UtilityButton label="SETTINGS" iconName="settings-outline"/>
                        <UtilityButton label="CREDITS" iconName="information-circle-outline"/>
                    </View>
                </View>
                <View>
                    <TransferButton
                        style={styles.mapButton}
                        functionName="map"
                        backgroundColor={ink}
                        pressedColor={lighten(ink, 0.25)}
                    >
                        <Ionicons name="map-outline" size={26} color={colors.primary}/>
                        <View style={{flex: 1, marginLeft: 14}}>
                            <Text numberOfLines={1} style={styles.mapButtonText}>
                                MAP
                            </Text>
                            <Text
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                style={styles.mapButtonSubtext}
                            >
                                2,000 YEARS OF THEOLOGY, PHILOSOPHY, AND POLITICS
                            </Text>
                        </View>
                        <Ionicons name="arrow-forward" size={20} color={cream}/>
                    </TransferButton>
                    <TransferButton
                        style={styles.directoryButton}
                        onPress={() => {}} //no route yet
                        backgroundColor="transparent"
                        pressedColor="rgba(0,0,0,0.08)"
                    >
                        <Ionicons name="list-outline" size={22} color={ink}/>
                        <Text numberOfLines={1} style={styles.directoryButtonText}>
                            DIRECTORY
                        </Text>
                        <Ionicons name="arrow-forward" size={17} color={ink}/>
                    </TransferButton>
                </View>
            </View>
        </LinearGradient>
  );
}

const styles = StyleSheet.create({
    portraitFrame: {
        width: '100%',
        borderBottomWidth: 3,
        borderColor: ink,
        backgroundColor: darken(colors.dark[300], 0.2),
    },
    figureNameBox: {
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 7,
        paddingBottom: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    figureNameText: {
        fontFamily: 'ArnoPro-Regular',
        fontSize: 15,
        letterSpacing: 1,
        color: cream,
        textAlign: 'center',
    },
    figureDatesText: {
        fontFamily: 'ArnoPro-Regular',
        fontSize: 12,
        color: lighten(colors.light[100], 0.3),
        textAlign: 'center',
        marginTop: 2,
    },
    quoteBox: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 13,
        paddingBottom: 12,
        alignItems: 'center',
    },
    quoteRule: {
        width: 2,
        alignSelf: 'stretch',
        marginRight: 9,
        marginVertical: 4,
        backgroundColor: darken(colors.dark[300], 0.3),
    },
    quoteText: {
        fontFamily: 'ArnoPro-Italic',
        fontSize: 16,
        lineHeight: 19,
        color: cream,
    },
    quoteSourceText: {
        fontFamily: 'ArnoPro-Regular',
        fontSize: 10,
        letterSpacing: 1,
        color: lighten(colors.light[100], 0.3),
        marginTop: 5,
    },
    mastheadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    displayTitleText: {
        fontFamily: 'ArnoPro-Regular',
        letterSpacing: 10,
        color: ink,
    },
    subtitleText: {
        fontFamily: 'ArnoPro-Italic',
        letterSpacing: 1,
        color: darken(colors.dark[300], 0.35),
        marginTop: 3,
    },
    utilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30
    },
    utilityButton: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        marginLeft: 6,
    },
    utilityText: {
        fontFamily: 'ArnoPro-Regular',
        fontSize: 14,
        letterSpacing: 1.5,
        color: ink,
        marginLeft: 5,
    },
    mapButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    mapButtonText: {
        fontFamily: 'ArnoPro-Bold',
        fontSize: 19,
        letterSpacing: 3,
        color: cream,
    },
    mapButtonSubtext: {
        fontFamily: 'ArnoPro-Regular',
        fontSize: 11,
        letterSpacing: 1,
        color: colors.light[100],
        marginTop: 2,
    },
    directoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1.5,
        borderColor: ink,
    },
    directoryButtonText: {
        flex: 1,
        fontFamily: 'ArnoPro-Bold',
        fontSize: 15,
        letterSpacing: 2,
        color: ink,
        marginLeft: 14,
    }
})
