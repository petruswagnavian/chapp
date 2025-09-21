export type Person = {
    pid: string;
    displayName: string;
    birthplace?: string;
    deathplace?: string;
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
        pid: "peter_the_apostle",
        displayName: "Peter the Apostle",
        birthplace: "Bethsaida, Galilee, Judaea, Roman Empire",
        deathplace: "Rome, Italia, Roman Empire",
        lat: 32.91089391890956,
        lon: 35.63200492242213,
        imageUrl: 'https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Saint_Peter-Sinai_%286th_Century%29_Crop.jpg/1024px-Saint_Peter-Sinai_%286th_Century%29_Crop.jpg',
        fromYear: -1,
        fromApprox: true,
        toYear: 65,
        toApprox: true,
        camps: ["Apostle"]
    },
    {
        pid: "matthew_the_apostle",
        displayName: "Matthew the Apostle",
        birthplace: "Capernaum, Galilee, Judaea, Roman Empire",
        deathplace: "Ethiopia or Persia",
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
        pid: "james_the_just",
        displayName: "James the Just",
        birthplace: "Nazareth, Galilee, Judaea, Roman Empire",
        deathplace: "Jerusalem, Judaea, Roman Empire",
        lat: 32.70234804256465,
        lon: 35.297873906995605,
        imageUrl: 'https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/9/96/Saint_James_the_Just.jpg',
        fromYear: 4,
        fromApprox: true,
        toYear: 62,
        toApprox: true,
        camps: ["Apostle"]
    },
    {
        pid: "paul_of_tarsus",
        displayName: "Paul of Tarsus",
        birthplace: "Tarsus, Cilicia, Roman Empire",
        deathplace: "Rome, Italia, Roman Empire",
        lat: 36.92,
        lon: 34.90,
        imageUrl: 'https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/7/79/Giovanni_Francesco_Barbieri_-_Saint_Paul.jpg/960px-Giovanni_Francesco_Barbieri_-_Saint_Paul.jpg?20190309231900',
        fromYear: 5,
        fromApprox: true,
        toYear: 65,
        toApprox: true,
        camps: ["Apostle"]
    },
    {
        pid: "john_the_apostle",
        displayName: "John the Apostle",
        birthplace: "Bethsaida, Galilee, Judaea, Roman Empire",
        deathplace: "Ephesus, Ionia, Asia Minor, Roman Empire",
        lat: 32.91089391890956,
        lon: 35.63200492242213,
        imageUrl: 'https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/7/79/Rubens_apostel_johannes_grt.jpg/1024px-Rubens_apostel_johannes_grt.jpg',
        fromYear: 6,
        fromApprox: true,
        toYear: 100,
        toApprox: true,
        camps: ["Apostle"]
    },
    {
        pid: "john_mark_the_evangelist",
        displayName: "John Mark the Evangelist",
        birthplace: "Cyrene, Cyrenaica, Roman Empire",
        deathplace: "Alexandria, Egypt, Roman Empire",
        lat: 32.819808224773865,
        lon: 21.859442918983255,
        imageUrl: 'https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/9/92/Frans_Hals_085.jpg/1024px-Frans_Hals_085.jpg',
        fromYear: 7,
        fromApprox: true,
        toYear: 68,
        toApprox: true,
        camps: ["Apostle"]
    },
    {
        pid: "luke_the_evangelist",
        displayName: "Luke the Evangelist",
        birthplace: "Antioch, Syria, Roman Empire",
        deathplace: "Thebes, Boeotia, Achaia, Roman Empire",
        lat: 36.20405931892094,
        lon: 36.16216594217945,
        imageUrl: 'https://images.weserv.nl/?url=myocn.net/wp-content/uploads/2019/10/St-Luke-2.jpeg',
        fromYear: 10,
        fromApprox: true,
        toYear: 94,
        toApprox: true,
        camps: ["Apostle"]
    },
    {
        pid: "judas_thaddaeus",
        displayName: "Judas Thaddaeus",
        birthplace: "Galilee, Judaea, Roman Empire",
        deathplace: "",
        lat: 32.69903106070133,
        lon: 35.303823054325235,
        imageUrl: 'https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/0/0d/Anthonis_van_Dyck%2C_Kunsthistorisches_Museum_Wien%2C_Gem%C3%A4ldegalerie_-_Apostel_Judas_Thadd%C3%A4us_-_GG_6809_-_Kunsthistorisches_Museum.jpg',
        fromYear: 10,
        fromApprox: true,
        toYear: 65,
        toApprox: true,
        camps: ["Apostle"]
    },
    {
        pid: "simon_magus",
        displayName: "Simon Magus",
        birthplace: "Gitta, Samaria, Judaea, Roman Empire",
        deathplace: "Rome, Italia, Roman Empire",
        lat: 32.275,
        lon: 35.190,
        imageUrl: 'https://images.weserv.nl/?url=miro.medium.com/v2/1*dtSfizyQhZ6dAVIujqL6FA.jpeg',
        fromYear: 15,
        fromApprox: true,
        toYear: 65,
        toApprox: true,
        camps: ["Gnostic"]
    },
    {
        pid: "clement_of_rome",
        displayName: "Clement of Rome",
        birthplace: "Rome, Italia, Roman Empire",
        deathplace: "Chersonesus, Crimea, Bosporan Kingdom, Roman Empire",
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
        pid: "ignatius_of_antioch",
        displayName: "Ignatius of Antioch",
        birthplace: "Syria, Roman Empire",
        deathplace: "Rome, Italia, Roman Empire",
        lat: 36.204930647486165,
        lon: 36.16699792842562,
        imageUrl: 'https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/b/bf/Hosios_Loukas_%28south_west_chapel%2C_south_side%29_-_Ignatios.jpg',
        fromYear: 45,
        fromApprox: true,
        toYear: 116,
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
        pid: "polycarp_of_smyrna",
        displayName: "Polycarp of Smyrna",
        birthplace: "Smyrna, Asia Minor, Roman Empire",
        deathplace: "Smyrna, Asia Minor, Roman Empire",
        lat: 38.42270378420375,
        lon: 27.14573543165261,
        imageUrl: 'https://images.weserv.nl/?url=orthodoxwiki.org/images/4/41/Polycarp.jpg',
        fromYear: 69,
        fromApprox: true,
        toYear: 155,
        toApprox: true,
        camps: ["Apostolic Father"]
    },
    {
        pid: "marcion_of_sinope",
        displayName: "Marcion of Sinope",
        birthplace: "Sinope, Pontus, Roman Empire",
        deathplace: "Rome, Italia, Roman Empire",
        lat: 42.02723141456593,
        lon: 35.151250446989664,
        imageUrl: "",
        fromYear: 85,
        fromApprox: true,
        toYear: 160,
        toApprox: true,
        camps: ["Gnostic"]
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