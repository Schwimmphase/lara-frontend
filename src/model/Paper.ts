import type { Author } from './Author'

// Model-class of a paper
export class Paper {
    readonly paperId: string;
    readonly title: string;
    // TODO ONLY TEST, change to authors
    readonly author: Author[];
    readonly year: number;
    readonly abstract: string;
    readonly citationCount: number;
    readonly referenceCount: number;
    readonly venue: string;
    readonly pdfUrl: string;

    constructor(paperId: string, title: string, authors: Author[], year: number, abstract: string, citationCount: number, referenceCount: number, venue: string, pdfUrl: string) {
        this.paperId = paperId;
        this.title = title;
        this.author = authors;
        this.year = year;
        this.abstract = abstract;
        this.citationCount = citationCount;
        this.referenceCount = referenceCount;
        this.venue = venue;
        this.pdfUrl = pdfUrl;
    }
}