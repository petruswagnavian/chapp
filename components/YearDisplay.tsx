import {Text, View, StyleSheet, Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface Props {
    year: number;
}

const YearDisplay = ({year}: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{year} AD </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: screenWidth / 5,
        height: screenHeight / 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontSize: 35,
        fontFamily: 'ArnoPro-Bold',
        textAlign: 'center'
    }
})

export default YearDisplay;