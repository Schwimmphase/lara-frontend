import { Language } from "./Language";

export class LanguageService {
    private static languages: Language[] = [
        new Language("Deutsch", "german", "de"),
        new Language("English", "english", "en")
    ];
    
    static getLanguages() {
        return this.languages;
    }
}