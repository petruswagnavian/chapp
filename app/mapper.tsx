import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {Link, router} from "expo-router";
import {list_of_ages, mappable_years} from "@/constants/ages_years";
import colors from '@/constants/colors';
import HomeButton from '@/components/HomeButton';
import AgeSelector, {Age} from '@/components/AgeSelector';
import YearDisplay from '@/components/YearDisplay';
import YearSlider from '@/components/YearSlider';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const findLatestMappableYear = (targetYear: number): number | null => {
    for (let i = mappable_years.length - 1; i >= 0; i--) {
        if (mappable_years[i] <= targetYear) {
            return mappable_years[i]
        }
    }
    return null;
}

const fetchGeojson = async (year: number) => {
    try {
        const url = `https://ch-geojson-bucket-petrus.s3.amazonaws.com/original_years_geojson_AD/${year}.geojson`;
        console.log(`Fetching GeoJSON for year ${year}: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log(
            `Successfully fetched GeoJSON for year ${year}. ` +
            `Received ${data.features?.length ?? 'unknown'} features.`
        );
        return data;
    } catch (err) {
        console.error(`Error fetching GeoJSON for year ${year}:`, err);
        return null;
    }
};

const Mapper = () => {
    const [selectedAge, setSelectedAge] = useState<Age>(list_of_ages[0])
    const [currentYear, setCurrentYear] = useState<number>(selectedAge.startYear)
    /*const [currentTheme, setCurrentTheme] = useState(colors[list_of_ages[0].id]);*/
    const handleSelectAge = (age: Age) => {
        setSelectedAge(age);
        setCurrentYear(age.startYear);
    }

    const visiblePersons = [
        {
            pid: "augustine_of_hippo",
            lat: 40,
            lon: 20,
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Saint_Augustine_by_Philippe_de_Champaigne.jpg',
            fromYear: 354,
            toYear: 430
        }
    ].filter(p => currentYear >= p.fromYear && currentYear <= p.toYear);

    const geojsonCache = useRef<Map<number, any>>(new Map()); //cache remembers all fetched years until app is closed
    const [snappedYear, setSnappedYear] = useState<number | null>(null);
    const [yearData, setYearData] = useState<any>(null);

    const [webviewLoaded, setWebviewLoaded] = useState(false);
    const webviewRef = useRef<WebView>(null);
    const handleLoadEnd = () => {
        console.log('[RN] Webview loaded');
        setWebviewLoaded(true);
    }
    useEffect(() => {
        const newSnappedYear = findLatestMappableYear(currentYear);
        if (newSnappedYear != null && newSnappedYear !== snappedYear) {
            setSnappedYear(newSnappedYear);

            const cached = geojsonCache.current.get(newSnappedYear);
            if (cached) {
                setYearData(cached); //use cache data
            } else {
                setYearData(null);
                fetchGeojson(newSnappedYear).then(data => {
                    if (data) {
                        geojsonCache.current.set(newSnappedYear, data); //store in cache
                        setYearData(data);
                    }
                }).catch(err => console.error(err));
            }
        }
    }, [currentYear])
    useEffect(() => {
        if (webviewLoaded && yearData && snappedYear != null) {
            console.log('[RN] posting UPDATE_YEAR', snappedYear);
            webviewRef.current?.postMessage(
                JSON.stringify({ type: 'UPDATE_YEAR', year: snappedYear, geojson: yearData })
            );
        }
    }, [webviewLoaded, yearData, snappedYear]);
    useEffect(() => {
        if (webviewLoaded && webviewRef.current) {
            console.log('[RN] posting UPDATE_PERSONS');
            webviewRef.current.postMessage(
                JSON.stringify({
                    type: 'UPDATE_PERSONS',
                    persons: visiblePersons
                })
            )
        }
    }, [webviewLoaded, currentYear])

    return (
        <View style={styles.container}>
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={require('@/assets/map/map.html')}
                onMessage={(event) => {
                    const message = event.nativeEvent.data;
                    if (message.startsWith('open_person:')) {
                        const pid = message.replace
                        ('open_person:', '');
                        router.push(`/person/${pid}`);
                    }
                }}
                onLoadEnd={handleLoadEnd}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                allowFileAccessFromFileURLs={true}
                style={styles.map}
            />
            <HomeButton />
            <YearDisplay year={currentYear} />
            <AgeSelector
                ages={list_of_ages}
                selectedAgeId={selectedAge.id}
                onSelectAge={handleSelectAge}
            />
            <YearSlider
                startYear={selectedAge.startYear}
                endYear={selectedAge.endYear}
                currentYear={currentYear}
                onYearChange={(year) => setCurrentYear(year)}
            />
            <View style={styles.bottomBar}/>
        </View>
    )
}
export default Mapper

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: screenWidth,
        height: screenHeight,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: screenWidth / 10,
        right: screenWidth / 5,
        height: 60,
        backgroundColor: colors.primary,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        zIndex: 1
    }
})