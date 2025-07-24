import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

interface Props {
    onPress?: () => void;
    style?: ViewStyle;
    iconSize?: number;
    iconColor?: string;
}

const HomeButton =
    ({onPress, style, iconSize = 28, iconColor = 'white'}: Props)=> {
    const navigation = useNavigation();
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            navigation.navigate('index');
        }
    }

    return (
        <TouchableOpacity onPress={handlePress}
        style={[styles.button, style]} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={iconSize} color={iconColor}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 30,
        zIndex: 10,
        elevation: 5,
    }
})

export default HomeButton;