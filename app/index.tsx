import React, {useEffect} from 'react';
import { Text, View } from "react-native";
import {useFonts} from 'expo-font';
import { Link } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';

export default function Index() {
    useEffect(() => {
        NavigationBar.setVisibilityAsync('hidden');
    })
    const [fontsLoaded] = useFonts({
        'ArnoPro-Regular': require('../assets/fonts/ArnoPro-Regular.otf'),
        'ArnoPro-Bold': require('../assets/fonts/ArnoPro-Bold.otf'),
    })
    if (!fontsLoaded) return null;
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-5xl text-light-200 font-bold">R.C. Sproul</Text>
            <Link href="/mapper">Mapper</Link>
        </View>
  );
}
