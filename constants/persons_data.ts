export type Person = {
    pid: string;
    lat: number;
    lon: number;
    imageUrl: string;
    fromYear: number;
    toYear: number;
}

export const all_persons: Person[] = [
    {
        pid: "matthew_the_apostle",
        lat: 32.88,
        lon: 35.57,
        imageUrl: 'https://i0.wp.com/www.thebestcatholic.com/wp-content/uploads/2016/09/The-Best-Catholic.Matthew5a319b0c116995afb26cab5af9e51e4c.wix_mp_1024.jpeg',
        fromYear: 4,
        toYear: 68
    },
    {
        pid: "paul_of_tarsus",
        lat: 36.92,
        lon: 34.90,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Giovanni_Francesco_Barbieri_-_Saint_Paul.jpg/960px-Giovanni_Francesco_Barbieri_-_Saint_Paul.jpg?20190309231900',
        fromYear: 5,
        toYear: 65
    },
    {
        pid: "clement_of_rome",
        lat: 41.88,
        lon: 12.59,
        imageUrl: 'https://lonelypilgrim.com/wp-content/uploads/2014/05/clement-of-rome.jpg?w=214',
        fromYear: 35,
        toYear: 101
    },
    {
        pid: "papias_of_hierapolis",
        lat: 37.91,
        lon: 29.11,
        imageUrl: 'https://pbcdn1.podbean.com/imglogo/ep-logo/pbblog17411067/papias.jpeg',
        fromYear: 60,
        toYear: 130
    },
    {
        pid: "augustine_of_hippo",
        lat: 36.90,
        lon: 7.75,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Saint_Augustine_by_Philippe_de_Champaigne.jpg',
        fromYear: 354,
        toYear: 430
    }
]