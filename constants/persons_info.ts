export type PersonInfo = {
    summary?: string;
    camp_note?: string;
}

export const persons_info: Record<string, PersonInfo> = {
    acacius_of_constantinople: {
        camp_note: `
Acacius was consecrated and formally stood in the Chalcedonian line, and he never denounced
the Council of Chalcedon outright. However, he drafted the Henotikon (482), which 
attempted to reconcile with the Miaphysites, and he entered communion with Miaphysites. Rome excommunicated him for these actions, 
triggering the 35-year Acacian Schism. The label
captures his formal standing, not his actual theological posture, which was
a deliberate straddle between the two camps.
        `.trim(),
    },
}
