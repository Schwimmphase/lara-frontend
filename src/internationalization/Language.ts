export class Language {
    readonly name: string;
    readonly nameEnglish: string;
    readonly abbreviation: string;

    constructor(name: string, nameEnglish: string, abbreviation: string) {
        this.name = name;
        this.nameEnglish = nameEnglish;
        this.abbreviation = abbreviation;
    }
}