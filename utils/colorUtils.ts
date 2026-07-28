import chroma from "chroma-js";

export function lighten(color: string, amount: number = 0.5): string {
    return chroma.mix(color, "#fff", amount, "lab").hex();
}
export function darken(color: string, amount: number = 0.5): string {
    return chroma.mix(color, "#000", amount, "lab").hex();
}