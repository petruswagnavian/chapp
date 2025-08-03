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
        pid: "paul_of_tarsus",
        lat: 36.92,
        lon: 34.90,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Giovanni_Francesco_Barbieri_-_Saint_Paul.jpg/960px-Giovanni_Francesco_Barbieri_-_Saint_Paul.jpg?20190309231900',
        fromYear: 5,
        toYear: 65
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