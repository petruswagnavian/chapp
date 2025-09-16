import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Platform } from 'react-native';

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
    const [pressed, setPressed] = React.useState<string | null>(null);
    return (
        <View style={styles.container}>
            <ScrollView
                persistentScrollbar
                keyboardShouldPersistTaps="always"
                contentContainerStyle={styles.scrollContainer}
            >
                {ages.map((age) => {
                    const isSelected = age.id === selectedAgeId;
                    const isPressed = pressed === age.id;
                    return (
                        <Pressable
                            key={age.id}
                            onPress={() => onSelectAge(age)}
                            onPressIn={() => setPressed(age.id)}
                            onPressOut={() => setPressed(null)}
                            style={[
                                styles.button,
                                isSelected && styles.selectedButton,
                                isPressed && styles.pressedButton
                            ]}
                        >
                            <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
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
        backgroundColor: '#ddd',
        zIndex: 10,
        ...(Platform.OS === 'android' ? { elevation: 10 } : null),
    },
    scrollContainer: {
        paddingVertical: 0,
        alignItems: 'stretch',
    },
    button: {
        marginVertical: 3,
        paddingVertical: 12,
        paddingHorizontal: 8,
        minHeight: 44,
        borderRadius: 0,
        backgroundColor: '#ddd',
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
        fontSize: 18,
        fontFamily: 'ArnoPro-Regular',
        textAlign: 'center',
        color: '#000',
        maxWidth: 150,
    },
    selectedText: {
        color: '#fff',
        fontFamily: 'ArnoPro-Bold',
    },
    test: {
        backgroundColor: 'blue', padding: 20, alignItems: 'center'
    }
});

export default AgeSelector;
