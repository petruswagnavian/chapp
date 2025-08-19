import React from 'react';
import { Pressable, StyleProp, ViewStyle, StyleSheet, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';

interface Props {
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    iconSize?: number;
    iconColor?: string;
    backgroundColor?: string;
    pressedColor?: string;
}

const BackButton =
    ({onPress, style, iconSize = 28, iconColor = 'black',
         backgroundColor = '#000', pressedColor = '#555'}: Props)=> {
    const navigation = useNavigation();
    const router = useRouter();
    const [pressed, setPressed] = React.useState(false);
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                router.push('/');
            }
        }
    }
    //console.log('BackButton style:', style);
    //console.log('BG props', { backgroundColor, pressedColor });

    return (
        <View style={[style, {backgroundColor: pressed ? pressedColor : backgroundColor}]}>
            <Pressable
                onPress={handlePress}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                style={styles.fillCenter}
                hitSlop={4}
            >
                <Ionicons name="arrow-back" size={iconSize} color={iconColor}/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    fillCenter: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default BackButton;