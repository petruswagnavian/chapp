import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {WebView} from 'react-native-webview';
import {Link, router} from "expo-router";
import {list_of_ages, mappable_years} from '@/constants/ages_years';
import {all_persons} from '@/constants/persons_data';
import colors from '@/constants/colors';
import HomeButton from '@/components/HomeButton';
import AgeSelector, {Age} from '@/components/AgeSelector';
import YearDisplay from '@/components/YearDisplay';
import YearSlider from '@/components/YearSlider';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const DEBOUNCE_MAP_MS = 30;
const DEBOUNCE_PERSONS_MS = 30;

function useDebouncedValue<T>(value: T, delay: number) {
    const [debounced, setDebounced] = React.useState(value);
    React.useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

const findLatestMappableYear = (targetYear: number): number | null => {
    for (let i = mappable_years.length - 1; i >= 0; i--) {
        if (mappable_years[i] <= targetYear) {
            return mappable_years[i]
        }
    }
    return null;
}

const fetchGeojson = async (year: number, signal?: AbortSignal) => {
    const url = `https://ch-geojson-bucket-petrus.s3.amazonaws.com/original_years_geojson_AD/${year}.geojson`;
    //console.log(`Fetching GeoJSON for year ${year}: ${url}`);
    const response = await fetch(url, {signal});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    /*
    console.log(
        `Successfully fetched GeoJSON for year ${year}. ` +
        `Received ${data.features?.length ?? 'unknown'} features.`
    );

     */
    return data;
}

type Commit = {
    year: number;
    data: any;
    seq: number;
}

const Mapper = () => {
    const [selectedAge, setSelectedAge] = useState<Age>(list_of_ages[0])
    const [currentYear, setCurrentYear] = useState<number>(selectedAge.startYear)
    const handleSelectAge = (age: Age) => {
        setSelectedAge(age);
        setCurrentYear(age.startYear);
        //geojsonCache.current.clear(); //should i?
    }

    //const [snappedYear, setSnappedYear] = useState<number | null>(null);
    //const [yearData, setYearData] = useState<any>(null);

    //webview
    const [webviewLoaded, setWebviewLoaded] = useState(false);
    const webviewRef = useRef<WebView>(null);
    const handleLoadEnd = () => {
        //console.log('[RN] Webview loaded');
        setWebviewLoaded(true);
    }

    const geojsonCache = useRef<Map<number, any>>(new Map()); //cache remembers all fetched years until app is closed
    const inflight = useRef<Map<number, Promise<any>>>(new Map());
    const mapSeqRef = useRef(0);
    const personsSeqRef = useRef(0);

    const mapDebouncedYear = useDebouncedValue(currentYear, DEBOUNCE_MAP_MS);
    const personsDebouncedYear = useDebouncedValue(currentYear, DEBOUNCE_PERSONS_MS);

    //atomic map commit state
    const [mapCommit, setMapCommit] = useState<Commit | null>(null);

    const visiblePersons = useMemo(() => {
        return all_persons.filter(p => personsDebouncedYear >= p.fromYear && personsDebouncedYear <= p.toYear);
    }, [personsDebouncedYear]);

    //map debounce and snapped years
    useEffect(() => {
        const targetYear = findLatestMappableYear(mapDebouncedYear);
        if (targetYear == null) return;

        if (mapCommit?.year === targetYear) return;

        const seq = ++mapSeqRef.current;

        const cached = geojsonCache.current.get(targetYear);
        if (cached) {
            setMapCommit({
                year: targetYear,
                data: cached, seq
            })
            return;
        }
        let p = inflight.current.get(targetYear);
        if (!p) {
            p = fetchGeojson(targetYear).then(data => {
                geojsonCache.current.set(targetYear, data);
                inflight.current.delete(targetYear);
                return data;
            }).catch(err => {
                inflight.current.delete(targetYear);
                //if (err?.name !== 'AbortError') console.error(`Error fetching GeoJSON for year ${targetYear}:`, err)
                throw err;
            })
            inflight.current.set(targetYear, p);
        }
        p.then(data => {
            if (mapSeqRef.current === seq) {
                setMapCommit({year: targetYear, data, seq});
            }
        }).catch(() => {})
    }, [mapDebouncedYear, mapCommit?.year])

    //map commit to WebView
    useEffect(() => {
        if (!webviewLoaded || !mapCommit) return;
        //.log(`[RN] posting UPDATE_YEAR ${mapCommit.year}`)
        webviewRef.current?.postMessage(JSON.stringify({
            type: 'UPDATE_YEAR',
            year: mapCommit.year,
            geojson: mapCommit.data,
            version: mapCommit.seq
        }))
    }, [webviewLoaded, mapCommit]);

    //person debounce
    useEffect(() => {
        if (!webviewLoaded) return
        //console.log('[RN] posting UPDATE_PERSONS');
        const seq = ++personsSeqRef.current;
        webviewRef.current?.postMessage(JSON.stringify({
            type: 'UPDATE_PERSONS',
            persons: visiblePersons,
            year: personsDebouncedYear,
            personsVersion: seq
        }))
    }, [webviewLoaded, visiblePersons, personsDebouncedYear])

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
        bottom: -10,
        left: screenWidth / 10,
        right: screenWidth / 5,
        height: 70,
        borderRadius: 8,

        backgroundColor: colors.primary,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        zIndex: 1
    }
})