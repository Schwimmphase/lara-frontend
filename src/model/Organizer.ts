import type { Paper } from "./Paper";

export class Organizer {
    readonly name: string;
    
    constructor(name: string) {
        this.name = name;
    }

    organize(paper: Paper[]) {} // Array ok? (weil TS selber keine Lists hat)
}