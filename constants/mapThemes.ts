const baseMapStyle = [
    {
        featureType: "administrative",
        elementType: "all",
        stylers: [{visibility: "off"}],
    },
    {
        featureType: "landscape",
        elementType: "labels",
        stylers: [{visibility: "on"}],
    },
    {
        featureType: "landscape.man_made",
        elementType: "all",
        stylers: [{visibility: "off"}],
    },
    {
        featureType: "road",
        elementType: "all",
        stylers: [{visibility: "off"}]
    },
    {
        featureType: "poi",
        elementType: "all",
        stylers: [{visibility: "off"}],
    },
    {
        featureType: "transit",
        elementType: "all",
        stylers: [{visibility: "off"}],
    },
    {
        featureType: "water",
        elementType: "labels",
        stylers: [{"color": "#000000"}]
    }
]

const apostolicAgeTheme = [
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#a0c8cf"}]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#f1e6c6"}]
    }
]
const greatAgeTheme = [
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#98e81e"}]
    }
]
const niceneAgeTheme = [
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#f2d12c"}]
    }
]
const chalcedonAgeTheme = [
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#f28f2c"}]
    }
]
const eastWestAgeTheme = [
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#b561f0"}]
    }
]
const highMiddleAgeTheme = [
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#aa9eb2"}]
    }
]
const lateMiddleAgeTheme = [
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#844d4d"}]
    }
]
const reformationAgeTheme =[
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#cc4848"}]
    }
]
const westphalianAgeTheme = [
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#be6507"}]
    }
]
const modernAgeTheme =[
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#b5e4ea"}]
    }
]

const mapThemes = {
    apostolic_age: apostolicAgeTheme,
    great_age: greatAgeTheme,
    nicene_age: niceneAgeTheme,
    chalcedon_age: chalcedonAgeTheme,
    eastWest_age: eastWestAgeTheme,
    highMiddle_age: highMiddleAgeTheme,
    lateMiddle_age: lateMiddleAgeTheme,
    reformation_age: reformationAgeTheme,
    westphalian_age: westphalianAgeTheme,
    modern_age: modernAgeTheme
}

export default mapThemes
