import type { Author } from './Author'

// Model-class of a paper
export class Paper {
    readonly id: string;
    readonly title: string;
    readonly year: number;
    readonly abstract: string;
    readonly citationCount: number;
    readonly referenceCount: number;
    readonly venue: string;
    readonly pdfUrl: string;
    readonly authors: Author[];

    constructor(id: string, title: string, year: number, abstract: string, citationCount: number, referenceCount: number, venue: string, pdfUrl: string, authors: Author[]) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.abstract = abstract;
        this.citationCount = citationCount;
        this.referenceCount = referenceCount;
        this.venue = venue;
        this.pdfUrl = pdfUrl;
        this.authors = authors;
    }
}