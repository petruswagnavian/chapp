import {Text, View, Dimensions} from 'react-native';

//const screenWidth = Dimensions.get('window').width;
//const screenHeight = Dimensions.get('window').height;

interface Props {
    year: number;
    layout: {width: number, height: number};
}

const YearDisplay = ({year, layout}: Props) => {
    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: layout.width / 5,
                height: layout.height / 5,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text
                style={{
                    color: 'white',
                    fontSize: 35,
                    fontFamily: 'ArnoPro-Bold',
                    textAlign: 'center'
                }}
            >
                {year} AD
            </Text>
        </View>
    )
}

export default YearDisplay;