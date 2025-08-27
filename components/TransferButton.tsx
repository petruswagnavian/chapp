import React from 'react';
import {Pressable, StyleProp, ViewStyle, StyleSheet, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import {useNavigation, useRouter} from 'expo-router';

interface Props {
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    iconSize?: number;
    iconColor?: string;
    functionName?: 'back' | 'map';
    backgroundColor?: string;
    pressedColor?: string;
}

const functionIcon: Record<NonNullable<Props['functionName']>,
    {lib: 'Ionicons' | 'Entypo'; name: string}
> = {
    back: {lib: 'Ionicons', name: 'arrow-back'},
    map: {lib: 'Entypo', name: 'globe'}
}

const TransferButton =
    ({onPress, style, iconSize = 28, iconColor = 'black', functionName = 'back',
         backgroundColor = '#000', pressedColor = '#555'}: Props)=> {
    const navigation = useNavigation();
    const router = useRouter();
    const [pressed, setPressed] = React.useState(false);
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            if (functionName === 'back') {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    router.push('/');
                }
            }
        }
    }

    const iconConfig = functionIcon[functionName];
    const IconComponent = iconConfig.lib === 'Ionicons' ? Ionicons : Entypo
    //console.log('TransferButton style:', style);
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
                <IconComponent name={iconConfig.name as any} size={iconSize} color={iconColor}/>
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

export default TransferButton;