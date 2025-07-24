import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect} from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import './globals.css';

export default function RootLayout() {
    useEffect(() => {
        if (Platform.OS === 'android') {
            (async () => {
                await NavigationBar.setBehaviorAsync("overlay-swipe");
                await NavigationBar.setVisibilityAsync("hidden");
            })();
        }
    }, []);
    return (
      <SafeAreaProvider>
        <Stack >
            <Stack.Screen
              name="index"
              options={{headerShown: false}}
            />
            <Stack.Screen
                name="mapper"
                options={{
                  title: "",
                  headerBackTitleVisible: false,
                }}
            />
        </Stack>
      </SafeAreaProvider>
  );
}
