import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect} from "react";
import { StatusBar } from "react-native";
import * as SystemUI from "expo-system-ui";
import './globals.css';

export default function RootLayout() {
    useEffect(() => {
        SystemUI.setBackgroundColorAsync("transparent");
        StatusBar.setHidden(true);
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
                options={{headerShown: false}}
            />
        </Stack>
      </SafeAreaProvider>
  );
}
