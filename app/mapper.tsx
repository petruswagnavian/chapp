import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {Link} from "expo-router";
import HomeButton from '@/components/HomeButton';
import AgeSelector, {Age} from '@/components/AgeSelector';
import YearDisplay from '@/components/YearDisplay';
import YearSlider from '@/components/YearSlider';
import gestureHandlerButtonWeb from "react-native-gesture-handler/src/components/GestureHandlerButton.web";

const list_of_ages: Age[] = [
    {id: 'apostolic_age', label: 'APOSTOLIC CHURCH', startYear: 33, endYear: 179},
    {id: 'great_age', label: 'GREAT CHURCH', startYear: 180, endYear: 324},
    {id: 'nicene_age', label: 'NICENO-ROMAN AGE', startYear: 325, endYear: 450},
    {id: 'chalcedon_age', label: 'CHALCEDONIAN AGE', startYear: 451, endYear: 786},
    {id: 'eastWest_age', label: 'EAST-WEST CONFLICT', startYear: 787, endYear: 1053},
    {id: 'highMiddle_age', label: 'HIGH MIDDLE AGES', startYear: 1054, endYear: 1301},
    {id: 'lateMiddle_age', label: 'LATE MIDDLE AGES', startYear: 1302, endYear: 1516},
    {id: 'reformation_age', label: 'REFORMATION', startYear: 1517, endYear: 1647},
    {id: 'westphalian_age', label: 'REVIVAL AND REASON', startYear: 1648, endYear: 1913},
    {id: 'modern_age', label: 'MODERN AGE', startYear: 1914, endYear: 2025},
]

const MAPPABLE_YEARS = [1, 6, 9, 14, 23, 30, 43, 51, 60, 68, 78, 84, 91, 106, 114, 117, 127,
    154, 161, 165, 184, 197, 207, 215, 224, 238, 247, 260, 261, 263, 265, 270, 283, 287, 299, 306,
    308, 311, 313, 324, 337, 338, 347, 353, 358, 367, 371, 373, 378, 383, 387, 390, 392, 394, 395,
    396, 397, 402, 407, 410, 414, 417, 426, 439, 441, 443, 451, 452, 455, 458, 459, 462, 469, 476,
    480, 490, 500, 510, 523, 534, 536, 540, 546, 555, 561, 567, 569, 577, 587, 592, 602, 612, 617,
    623, 626, 627, 628, 629, 630, 633, 634, 638, 641, 644, 647, 656, 661, 666, 674, 682, 692, 705,
    710, 718, 724, 732, 741, 750, 751, 755, 757, 763, 768, 772, 775, 778, 783, 788, 793, 800, 806,
    814, 825, 830, 840, 850, 860, 866, 870, 875, 876, 878, 880, 882, 884, 886, 887, 888, 892, 896,
    898, 899, 900, 911, 922, 926, 936, 947, 960, 961, 962, 970, 980, 990, 1000, 1003, 1010, 1015,
    1018, 1028, 1034, 1040, 1046, 1056, 1066, 1072, 1085, 1094, 1099, 1111, 1126, 1139, 1147, 1152,
    1169, 1177, 1188, 1192, 1202, 1206, 1210, 1216, 1220, 1227, 1236, 1241, 1250, 1260, 1272, 1279,
    1285, 1294, 1305, 1314, 1326, 1333, 1344, 1352, 1363, 1375, 1385, 1395, 1402, 1407, 1415, 1422,
    1429, 1431, 1440, 1450, 1453, 1459, 1463, 1468, 1475, 1482, 1487, 1492, 1497, 1502, 1507, 1512,
    1516, 1519, 1521, 1526, 1529, 1534, 1540, 1547, 1552, 1556, 1564, 1572, 1579, 1582, 1588, 1595,
    1600, 1602, 1609, 1612, 1619, 1622, 1626, 1629, 1632, 1636, 1640, 1642, 1645, 1648, 1653, 1659,
    1662, 1670, 1673, 1677, 1683, 1687, 1691, 1696, 1700, 1702, 1706, 1709, 1713, 1718, 1721, 1727,
    1734, 1738, 1741, 1744, 1748, 1752, 1757, 1762, 1763, 1769, 1772, 1775, 1776, 1778, 1780, 1781,
    1783, 1788, 1791, 1792, 1794, 1796, 1797, 1799, 1800, 1803, 1805, 1806, 1807, 1809, 1811, 1812,
    1814, 1815, 1820, 1822, 1824, 1825, 1828, 1830, 1834, 1836, 1840, 1842, 1846, 1848, 1849, 1853,
    1856, 1857, 1859, 1860, 1861, 1862, 1863, 1864, 1865, 1866, 1868, 1870, 1871, 1873, 1877, 1880,
    1885, 1890, 1895, 1898, 1900, 1905, 1908, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919,
    1920, 1922, 1924, 1926, 1927, 1928, 1929, 1930, 1932, 1936, 1938, 1939, 1940, 1941, 1942, 1943,
    1944, 1945, 1946, 1947, 1948, 1949, 1950, 1953, 1956, 1958, 1960, 1961, 1963, 1967, 1969, 1973,
    1976, 1979, 1983, 1987, 1990, 1991, 1992, 1996, 2000, 2006, 2014]

const findLatestMappableYear = (targetYear: number): number | null => {
    for (let i = MAPPABLE_YEARS.length - 1; i >= 0; i--) {
        if (MAPPABLE_YEARS[i] <= targetYear) {
            return MAPPABLE_YEARS[i]
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

    return (
        <View style={styles.container}>
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={require('@/assets/map/map.html')}
                onLoadEnd={handleLoadEnd}
                javaScriptEnabled
                domStorageEnabled
                allowFileAccess
                allowUniversalAccessFromFileURLs
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
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
})