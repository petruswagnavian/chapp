import {all_persons, Person} from "@/constants/persons_data";

export type CampGroup = string[];

export const titleScreenCampGroups: CampGroup[] = [
    ["Apostle", "Apostolic Father"],
    ["Nicene"],
    ["Augustinian", "Massilian"]
];

export function getRandomPersonFromCamps(
    campsAllowed: CampGroup,
    excludePids: Set<string> = new Set()
): Person | null {
    const pool = all_persons.filter((person) => {
        const hasImage = person.imageUrl && person.imageUrl.trim().length > 0;
        const isInAllowedCamp = person.camps.some((camp) => campsAllowed.includes(camp));
        const isNotAlreadyUsed = !excludePids.has(person.pid);

        return hasImage && isInAllowedCamp && isNotAlreadyUsed;
    });

    if (pool.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}

export function getRandomTitleScreenPersons(): [Person | null, Person | null, Person | null] {
    const usedPids = new Set<string>();

    const firstPerson = getRandomPersonFromCamps(titleScreenCampGroups[0], usedPids);
    if (firstPerson) {
        usedPids.add(firstPerson.pid);
    }

    const secondPerson = getRandomPersonFromCamps(titleScreenCampGroups[1], usedPids);
    if (secondPerson) {
        usedPids.add(secondPerson.pid);
    }

    const thirdPerson = getRandomPersonFromCamps(titleScreenCampGroups[2], usedPids);
    if (thirdPerson) {
        usedPids.add(thirdPerson.pid);
    }

    return [firstPerson, secondPerson, thirdPerson];
}