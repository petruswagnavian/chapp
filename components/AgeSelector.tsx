import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Platform } from 'react-native';
import colors from '@/constants/colors';
import {lighten, darken} from "@/utils/colorUtils"

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export type Age = { id: string; label: string; startYear: number; endYear: number; };

interface Props {
    ages: Age[];
    selectedAgeId: string;
    onSelectAge: (age: Age) => void;
    onPress?: () => void;
    backgroundColor?: string;
    pressedColor?: string;
}

const AgeSelector = ({ ages, selectedAgeId, onSelectAge, onPress, backgroundColor = '#000', pressedColor = '#555' }: Props) => {
    //const [pressed, setPressed] = React.useState<string | null>(null);
    return (
        <View style={styles.container}>
            <ScrollView
                //persistentScrollbar
                contentContainerStyle={styles.scrollContainer}
            >
                {ages.map((age) => {
                    const isSelected = age.id === selectedAgeId;
                    //const isPressed = pressed === age.id;
                    const ageColor = colors.age[age.id as keyof typeof colors.age];
                    return (
                        <Pressable
                            key={age.id}
                            onPress={() => onSelectAge(age)}
                            /*
                            onPressIn={() => setPressed(age.id)}
                            onPressOut={() => setPressed(null)}
                             */
                            style={[
                                styles.button, {
                                    backgroundColor: colors.primary
                                },
                                isSelected && {backgroundColor: ageColor},
                                //isPressed && {backgroundColor: lighten(ageColor, 0.4)}
                            ]}
                        >
                            <Text
                                numberOfLines={1} adjustsFontSizeToFit
                                style={[styles.buttonText, isSelected && styles.selectedText]}
                            >
                                {age.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        top: screenHeight / 5,
        bottom: 60,
        width: screenWidth / 5,
        //backgroundColor: '#ddd',
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: '#000',
        zIndex: 10,
        ...(Platform.OS === 'android' ? { elevation: 10 } : null),
    },
    scrollContainer: {
        alignItems: 'stretch',
        gap: 3,
        backgroundColor: '#000'

    },
    button: {
        borderRadius: 0,
        backgroundColor: '#ddd',
        height: (screenHeight / 7),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressedButton: {
        backgroundColor: 'red',
    },
    selectedButton: {
        backgroundColor: '#333',
    },
    buttonText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center', //android only ?
        fontSize: 16,
        fontFamily: 'ArnoPro-Regular',
        color: '#000',
        width: '95%'
    },
    selectedText: {
        color: '#fff',
        fontFamily: 'ArnoPro-Bold',
    }
});

export default AgeSelector;
