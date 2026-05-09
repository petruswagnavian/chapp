import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {Link, router} from "expo-router";
import {list_of_ages, mappable_years} from '@/constants/ages_years';
import {all_persons} from '@/constants/persons_data';
import colors from '@/constants/colors';
import ClusterPanel from '@/components/ClusterPanel';
import TransferButton from '@/components/TransferButton';
import AgeSelector, {Age} from '@/components/AgeSelector';
import YearDisplay from '@/components/YearDisplay';
import YearSlider from '@/components/YearSlider';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const DEFAULT_PERSON_IMAGE = Image.resolveAssetSource(
    require('@/assets/images/default_person.png')
).uri;

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
    console.log(`Fetching GeoJSON for year ${year}: ${url}`);
    const response = await fetch(url, {signal});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log(
        `Successfully fetched GeoJSON for year ${year}. ` +
        `Received ${data.features?.length ?? 'unknown'} features.`
    );
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

    const sendConfigToWebView = () => {
        webviewRef.current?.postMessage(JSON.stringify({
            type: "SET_CONFIG",
            colors,
            defaultImage: DEFAULT_PERSON_IMAGE
        }))
    }

    const handleSelectAge = (age: Age) => {
        setSelectedAge(age);
        setCurrentYear(age.startYear);
        //geojsonCache.current.clear(); //should i?
    }

    //webview
    const [webviewLoaded, setWebviewLoaded] = useState(false);
    const webviewRef = useRef<WebView>(null);
    const handleLoadEnd = () => {
        console.log('[RN] Webview loaded');
        setWebviewLoaded(true);
        sendConfigToWebView();
    }

    const [layout, setLayout] = useState<{ width: number; height: number }>({
        width: screenWidth,
        height: screenHeight,
    });

    const [clusterMarkers, setClusterMarkers] = useState<any[]>([]);
    const [isClusterPanelVisible, setClusterPanelVisible] = useState(false);

    const geojsonCache = useRef<Map<number, any>>(new Map()); //cache remembers all fetched years until app is closed
    const inflight = useRef<Map<number, Promise<any>>>(new Map());
    const mapSeqRef = useRef(0);
    const personsSeqRef = useRef(0);

    const mapDebouncedYear = useDebouncedValue(currentYear, DEBOUNCE_MAP_MS);
    const personsDebouncedYear = useDebouncedValue(currentYear, DEBOUNCE_PERSONS_MS);

    //atomic map commit state
    const [mapCommit, setMapCommit] = useState<Commit | null>(null);

    const normalize = (s?: string) => (s ?? '').toLowerCase().replace(/\s+/g,"_");
    const campColorOf = (camps: string[], mainCamp?: string) => {
        const table = (colors.camp ?? {}) as Record<string, string>;
        const key = mainCamp ?? camps?.[0];
        if (!key) return '#000';
        if (table[key]) return table[key];
        const hit = Object.entries(table).find(([k]) => normalize(k) === normalize(key));
        return hit ? hit[1] : '#000';
    };
    const visiblePersons = useMemo(() => {
        return all_persons
            .filter(p => personsDebouncedYear >= p.fromYear && personsDebouncedYear <= p.toYear)
            .map(p => {
                const finalImageUrl = (p.imageUrl && p.imageUrl.trim() != "")
                    ? p.imageUrl
                    : DEFAULT_PERSON_IMAGE;
                return {
                    ...p,
                    imageUrl: finalImageUrl,
                    campColor: campColorOf(p.camps ?? [], p.mainCamp)
                }
            });
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
                if (err?.name !== 'AbortError') console.error(`Error fetching GeoJSON for year ${targetYear}:`, err)
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
        console.log(`[RN] posting UPDATE_YEAR ${mapCommit.year}`)
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
        <View
            style={{flex: 1}}
            onLayout={(e) => {
                const {width, height} = e.nativeEvent.layout;
                setLayout({width, height});
            }}
        >
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={require('@/assets/map/map.html')}
                onMessage={(event) => {
                    try {
                        const rawMsg = event.nativeEvent.data;
                        if (rawMsg.startsWith('open_person:')) {
                            const pid = rawMsg.replace('open_person:', '');
                            router.push(`/person/${pid}`);
                            return;
                        }
                        const parsedMsg = JSON.parse(rawMsg);
                        if (parsedMsg.type === "OPEN_CLUSTER_PANEL") {
                            setClusterMarkers(parsedMsg.markers);
                            setClusterPanelVisible(true);
                        }
                    } catch (err) {
                        console.warn('bad message from WebView: ', err);
                    }
                }}
                onLoadEnd={handleLoadEnd}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                allowFileAccessFromFileURLs={true}
                style={{width: layout.width, height: layout.height}}
            />
            <ClusterPanel
                visible={isClusterPanelVisible}
                markers={clusterMarkers}
                onClose={() => setClusterPanelVisible(false)}
                onSelect={(marker) => {
                    setClusterPanelVisible(false);
                    router.push(`/person/${marker.pid}`);
                }}
            />
            <TransferButton
                style={{
                    position: 'absolute',
                    bottom: 0,
                    height: 60,
                    left: 0,
                    width: layout.width / 10,
                    borderRadius: 0,
                    borderTopWidth: 3,
                    zIndex: 5,
                }}
                functionName="back"
                backgroundColor={colors.dark[300]}
                pressedColor={colors.dark[200]}
                showIcon={true}
            />

            <YearDisplay
                year={currentYear}
                layout={layout}
            />
            <AgeSelector
                ages={list_of_ages}
                selectedAgeId={selectedAge.id}
                onSelectAge={handleSelectAge}
                layout={layout}
            />
            <YearSlider
                startYear={selectedAge.startYear}
                endYear={selectedAge.endYear}
                currentYear={currentYear}
                onYearChange={(year) => setCurrentYear(year)}
                layout={layout}
            />
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    height: 60,
                    left: layout.width / 10,
                    right: layout.width / 5,
                    borderRadius: 0,
                    backgroundColor: colors.primary,
                    borderTopWidth: 3,
                    borderLeftWidth: 3,
                    borderRightWidth: 3,
                    zIndex: 1
                }}
            />
        </View>
    )
}
export default Mapper;