import React, {useState, useEffect} from 'react';
import {View, Text, Image, FlatList, Pressable, TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import colors from "@/constants/colors"

interface Marker {
    pid: string;
    displayName: string;
    imageUrl: string;
}

interface Props {
    visible: boolean;
    markers: any[];
    onClose: () => void;
    onSelect: (marker: Marker) => void;
}

const ClusterPanel =
    ({visible, markers, onClose, onSelect}: Props) =>  {

    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    const [render, setRender] = useState(visible);

    useEffect(() => {
        if (visible) {
            setRender(true);
            scale.value = withSpring(1, {damping: 50});
            opacity.value = withTiming(1, {duration: 150});
        } else {
            scale.value = withSpring(0.9, {damping: 50});
            opacity.value = withTiming(0, {duration: 150});
            const timeout = setTimeout(() => setRender(false), 150);
            return () => clearTimeout(timeout);
        }
    }, [visible])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scale.value}],
        opacity: opacity.value
    }))

    if (!render) return null;

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.overlay}
                onPress={onClose}
            />
            <Animated.View style={[styles.panel, animatedStyle]}>
                <FlatList
                    style={{flexGrow: 0}}
                    data={markers}
                    keyExtractor={(item) => item.pid}
                    contentContainerStyle={{padding: 0}}
                    showsVerticalScrollIndicator={true}
                    renderItem={({item, index}) => (
                        <TouchableOpacity
                            onPress={() => onSelect(item)}
                            style={[
                                styles.button,
                                index === markers.length - 1 && {borderBottomWidth: 0}
                            ]}
                        >
                            <View style={styles.buttonContent}>
                                <Image
                                    source={{uri: item.imageUrl}}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        borderWidth: 3,
                                        borderColor: item.campColor,
                                    }}
                                    resizeMode="cover"
                                    onError={e => console.log("Image failed", e.nativeEvent.error)}
                                />
                                <Text style={styles.buttonText}>
                                    {item.displayName.toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5000
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    panel: {
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 16,
        padding: 16,
        minWidth: "30%",
        maxHeight: "60%",
        zIndex: 5001,
    },
    button: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    buttonText: {
        fontFamily: 'ArnoPro-Regular',
        fontSize: 16
    }
})

export default ClusterPanel;