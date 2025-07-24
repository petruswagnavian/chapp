const baseMapStyle = [
    {
        featureType: "administrative",
        elementType: "all",
        stylers: [{visibility: "off"}],
    },
    {
        featureType: "landscape",
        elementType: "labels",
        stylers: [{visibility: "off"}],
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
        "stylers": [{"color": "#6c32d8"}]
    }
]

const greatAgeTheme = [
    ...baseMapStyle,
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#37b029"}]
    }
]

const mapThemes = {
    apostolic_age: apostolicAgeTheme,
    great_age: greatAgeTheme,
}

export default mapThemes
