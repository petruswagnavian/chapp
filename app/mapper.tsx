import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {Link} from "expo-router";

const Mapper = () => {
    return (
        <View>
            <Text>Mapper</Text>
            <Link href="/person/augustine">Augustine of Hippo</Link>
        </View>
    )
}
export default Mapper
const styles = StyleSheet.create({})