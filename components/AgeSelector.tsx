import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export type Age = {
    id: string;
    label: string;
    startYear: number;
    endYear: number;
}

interface Props {
    ages: Age[];
    selectedAgeId: string;
    onSelectAge: (age: Age) => void;
}

const AgeSelector = ({ages, selectedAgeId, onSelectAge }: Props) => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {ages.map((age) => {
                    const isSelected = age.id === selectedAgeId;
                    return (
                        <TouchableOpacity
                            key={age.id}
                            style={[styles.button, isSelected && styles.selectedButton]}
                            onPress={() => onSelectAge(age)}
                        >
                            <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
                                {age.label}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        top: screenHeight / 10,
        bottom: screenHeight / 10,
        width: screenWidth / 5.5,
        backgroundColor: '#ddd',
    },
    scrollContainer: {
        paddingVertical: 0,
        alignItems: 'stretch',
    },
    button: {
        marginVertical: 3,
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderRadius: 0,
        backgroundColor: '#ddd',
        width: '100%',
        alignItems: 'center'
    },
    selectedButton: {
        backgroundColor: '#333'
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        color: "#000"
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    }
})

export default AgeSelector;