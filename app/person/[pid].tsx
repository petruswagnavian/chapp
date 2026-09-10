import {StyleSheet, Text, View, Dimensions, ColorValue, ScrollView, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useLocalSearchParams} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {all_persons} from "@/constants/persons_data";
import type {WorkEntry} from "@/constants/persons_data";
import colors from "@/constants/colors";
import {lighten, darken} from "@/utils/colorUtils";
import TransferButton from "@/components/TransferButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// Hanging indent applied to every line after the first. Wrapped lines are that
// much narrower than the first, so measure at the narrow width and render at the
// wide one -- otherwise a line broken at full width re-wraps once indented, and
// that inner wrap gets no indent.
const WORK_INDENT = 20;

const WorkTitle = ({text, time, style, wrapStyle, timeStyle}: {text: string; time?: string; style: any; wrapStyle: any; timeStyle?: any}) => {
    const [lines, setLines] = useState<string[] | null>(null);
    // Non-breaking spaces keep the parenthesised date atomic. Left breakable it
    // splits across rows ("... to Hero (4th" / "cent. AD)"), which both reads
    // badly and defeats the tail match below. The space before it stays normal,
    // so the date can still move to a line of its own as one unit.
    const date = time ? `(${time.replace(/ /g, '\u00A0')})` : '';

    if (!lines) {
        return (
            <View style={{paddingRight: WORK_INDENT}}>
                <Text
                    style={style}
                    onTextLayout={(e) => setLines(e.nativeEvent.lines.map(l => l.text))}
                >
                    {date ? `${text} ${date}` : text}
                </Text>
            </View>
        );
    }

    return (
        <View>
            {lines.map((lineText, index) => {
                // Match on the parenthesised date alone, not on the leading space:
                // when the break falls at that space it is consumed as the line
                // break, leaving the date at the very start of the last line.
                const cut = date ? lineText.lastIndexOf(date) : -1;
                const dated = index === lines.length - 1 && cut >= 0
                    && cut + date.length >= lineText.trimEnd().length;
                return (
                    <Text key={index} style={[style, index > 0 && wrapStyle]}>
                        {dated ? lineText.slice(0, cut) : lineText}
                        {dated && <Text style={timeStyle}>{lineText.slice(cut)}</Text>}
                    </Text>
                );
            })}
        </View>
    );
};

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
    const imageUrl = person?.imageUrl?.trim() || undefined;
    useEffect(() => {
        if (imageUrl && infoScrollAreaWidth > 0) { //depends on person?.imageUrl and infoScrollAreaWidth
            Image.getSize(imageUrl, (w, h) => {
                const targetWidth = infoScrollAreaWidth - scrollAreaPadding * 2.4;
                const scaledHeight = h * (targetWidth / w);
                setImgHeight(scaledHeight);
            }, (error) => console.error("Failed to get image size", error));
        } else {
            setImgHeight(undefined);
        }
    }, [imageUrl, infoScrollAreaWidth, scrollAreaPadding]);
    if (!person) {
        return (
            <View style={{flex: 1}}>
                <Text>Error: no person found</Text>
            </View>
        )
    }

    const mainCamp = person.mainCamp ? person.mainCamp : person.camps[0];
    const mainCampId = mainCamp.replace(/\*/g, "").toLowerCase().replace(/\s+/g,"_");
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
    const birthplace = person.birthplace?.trim();
    const deathplace = person.deathplace?.trim();
    const hasKnownWritings =
        !!person.authentic_works?.length ||
        !!person.disputed_works?.length ||
        !!person.pseudo_works?.length;
    const renderWorkList = (works: WorkEntry[] | undefined) => {
        if (!works?.length) {
            return null;
        }
        return (
            <View style={styles.workItems}>
                {works.map((work, index) => (
                    <WorkTitle
                        key={`${work.text}-${index}`}
                        text={work.text}
                        time={work.time}
                        style={[
                            styles.workItem,
                            work.ital && styles.workItalic,
                        ]}
                        wrapStyle={styles.workItemWrap}
                        timeStyle={styles.workTime}
                    />
                ))}
            </View>
        );
    };

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
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.displayNameText}>
                    {displayNameCaps}
                </Text>
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
                                    paddingHorizontal: 1
                                }}
                                functionName="camp"
                                backgroundColor={mainCampColor}
                                pressedColor={lighten(mainCampColor, 0.3)}
                                showIcon={false}
                >
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={styles.mainCampButtonText}>{mainCampCaps}</Text>
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
                    {imageUrl && (
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
                    )}
                    <View style={{flexDirection: "row", paddingTop: scrollAreaPadding}}>
                        <Text style={styles.infoLabel}>Born:</Text>
                        <View style={{flex: 1}}>
                            <Text style={styles.infoValue}>{fromYear} AD</Text>
                            {birthplace && (
                                <Text style={styles.infoValue}>{birthplace}</Text>
                            )}
                        </View>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.infoLabel}>Died:</Text>
                        <View style={{flex: 1}}>
                            <Text style={styles.infoValue}>{toYear} AD</Text>
                            {deathplace && (
                                <Text style={styles.infoValue}>{deathplace}</Text>
                            )}
                        </View>
                    </View>
                    {hasKnownWritings && (
                        <View style={styles.knownWritingsBox}>
                            <Text style={styles.knownWritingsHeader}>Known writings:</Text>
                            <View style={styles.knownWritingsRows}>
                                {!!person.authentic_works?.length && (
                                    <View style={styles.workCategory}>
                                        <Text style={styles.workLabel}>Authentic:</Text>
                                        {renderWorkList(person.authentic_works)}
                                    </View>
                                )}
                                {!!person.disputed_works?.length && (
                                    <View style={styles.workCategory}>
                                        <Text style={styles.workLabel}>Disputed:</Text>
                                        {renderWorkList(person.disputed_works)}
                                    </View>
                                )}
                                {!!person.pseudo_works?.length && (
                                    <View style={styles.workCategory}>
                                        <Text style={styles.workLabel}>Pseudepigrapha:</Text>
                                        {renderWorkList(person.pseudo_works)}
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                    {!!person.works_about?.length && (
                        <View style={styles.knownWritingsBox}>
                            <Text style={styles.knownWritingsHeader}>{`Works about ${person.displayName}:`}</Text>
                            <View style={styles.knownWritingsRows}>
                                {renderWorkList(person.works_about)}
                            </View>
                        </View>
                    )}

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
        fontSize: 18,
        backgroundColor: '#777'
    },
    infoLabel: {
        width: 50, //born: width
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
        fontSize: 25
    },
    knownWritingsBox: {
        paddingTop: 8,
    },
    knownWritingsHeader: {
        fontFamily: 'ArnoPro-Bold',
        fontSize: 17,
        lineHeight: 20,
    },
    knownWritingsRows: {
        paddingLeft: 12,
    },
    workCategory: {
        marginTop: 2,
    },
    workLabel: {
        fontFamily: 'ArnoPro-Bold',
        fontSize: 16,
        lineHeight: 19,
    },
    workItems: {
        paddingLeft: 12,
        marginTop: 1,
    },
    workItem: {
        fontFamily: 'ArnoPro-Regular',
        fontSize: 16,
        lineHeight: 19,
    },
    workItalic: {
        fontFamily: 'ArnoPro-Italic',
    },
    workTime: {
        fontFamily: 'ArnoPro-Regular',
    },
    workItemWrap: {
        paddingLeft: WORK_INDENT
    },
})

export default Identity;