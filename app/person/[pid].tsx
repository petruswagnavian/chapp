import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {useLocalSearchParams} from "expo-router";

const Identity = () => {
    const { pid } = useLocalSearchParams();
    return (
        <View>
            <Text>Person: {pid}</Text>
        </View>
    )
}

export default Identity

const styles = StyleSheet.create({})