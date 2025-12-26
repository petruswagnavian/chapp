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
    functionName?: 'back' | 'map' | 'camp';
    backgroundColor?: string;
    pressedColor?: string;
    showIcon?: boolean;
    children?: React.ReactNode;
}

const functionIcon: Partial<Record<NonNullable<Props['functionName']>,
    {lib: 'Ionicons' | 'Entypo'; name: string}
>> = {
    back: {lib: 'Ionicons', name: 'arrow-back'},
    map: {lib: 'Entypo', name: 'globe'}
}

const TransferButton =
    ({onPress, style, iconSize = 28, iconColor = 'black', functionName = 'back',
         backgroundColor = '#000', pressedColor = '#555', showIcon = false, children}: Props)=> {
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
            if (functionName === 'map') {
                router.push('/mapper')
            }
        }
    }

    const iconConfig = functionName ? functionIcon[functionName] : undefined;
    const IconComponent = iconConfig?.lib === 'Ionicons' ? Ionicons : Entypo
    //console.log('TransferButton style:', style);
    //console.log('BG props', { backgroundColor, pressedColor });

    return (
        <Pressable
            onPress={handlePress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={[style, {backgroundColor: pressed ? pressedColor : backgroundColor, alignItems: 'center',
            justifyContent: 'center', flexDirection: 'row'  }]}
            hitSlop={4}
        >
            {showIcon && iconConfig && (
                <IconComponent name={iconConfig.name as any} size={iconSize} color={iconColor}/>
            )}
            {children}
        </Pressable>
    )
}

export default TransferButton;