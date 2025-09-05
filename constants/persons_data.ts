export type Person = {
    pid: string;
    displayName: string;
    lat: number;
    lon: number;
    imageUrl: string;
    fromYear: number;
    fromApprox?: boolean;
    toYear: number;
    toApprox?: boolean;
    camps: string[];
    mainCamp?: string;
}

export const all_persons: Person[] = [
    {
        pid: "matthew_the_apostle",
        displayName: "Matthew the Apostle",
        lat: 32.88,
        lon: 35.57,
        imageUrl: 'https://i0.wp.com/www.thebestcatholic.com/wp-content/uploads/2016/09/The-Best-Catholic.Matthew5a319b0c116995afb26cab5af9e51e4c.wix_mp_1024.jpeg',
        fromYear: 4,
        fromApprox: true,
        toYear: 68,
        toApprox: true,
        camps: ["Apostle"]
    },
    {
        pid: "paul_of_tarsus",
        displayName: "Paul of Tarsus",
        lat: 36.92,
        lon: 34.90,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Giovanni_Francesco_Barbieri_-_Saint_Paul.jpg/960px-Giovanni_Francesco_Barbieri_-_Saint_Paul.jpg?20190309231900',
        fromYear: 5,
        fromApprox: true,
        toYear: 65,
        toApprox: true,
        camps: ["Apostle"]
    },
    {
        pid: "clement_of_rome",
        displayName: "Clement of Rome",
        lat: 41.88,
        lon: 12.59,
        imageUrl: 'https://lonelypilgrim.com/wp-content/uploads/2014/05/clement-of-rome.jpg?w=214',
        fromYear: 35,
        fromApprox: true,
        toYear: 101,
        toApprox: true,
        camps: ["Apostolic Father"]
    },
    {
        pid: "papias_of_hierapolis",
        displayName: "Papias of Hierapolis",
        lat: 37.91,
        lon: 29.11,
        imageUrl: 'https://pbcdn1.podbean.com/imglogo/ep-logo/pbblog17411067/papias.jpeg',
        fromYear: 60,
        fromApprox: true,
        toYear: 130,
        toApprox: true,
        camps: ["Apostolic Father"]
    },
    {
        pid: "valentinus_gnostic",
        displayName: "Valentinus",
        lat: 41.88,
        lon: 12.59,
        imageUrl: 'https://bpb-us-e1.wpmucdn.com/blogs.uoregon.edu/dist/7/10891/files/2015/05/valentinus-1kiu29x.jpg',
        fromYear: 100,
        fromApprox: true,
        toYear: 180,
        toApprox: true,
        camps: ["Gnostic"]
    },
    {
        pid: "irenaeus_of_lyon",
        displayName: "Irenaeus of Lyon",
        lat: 45.76,
        lon: 4.84,
        imageUrl: 'https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/3/38/Saint_irenee_saint_irenee.jpg',
        fromYear: 125,
        fromApprox: true,
        toYear: 202,
        toApprox: true,
        camps: ["Western"]
    },
    {
        pid: "augustine_of_hippo",
        displayName: "Augustine of Hippo",
        lat: 36.90,
        lon: 7.75,
        imageUrl: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/saint-augustine-of-hippo-philippe-de-champaigne-war-is-hell-store.jpg',
        fromYear: 354,
        toYear: 430,
        camps: ["Western", "Nicene"]
    }
]