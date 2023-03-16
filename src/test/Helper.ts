import {User} from "@/model/User";
import {UserCategory} from "@/model/UserCategory";
import {Paper} from "@/model/Paper";
import type {Author} from "@/model/Author";
import {Research} from "@/model/Research";
import {expect} from "vitest";
import {Tag} from "@/model/Tag";
import type {SavedPaper} from "@/model/SavedPaper";

/* c8 ignore start */

export function getUserCategoryAdmin(): UserCategory {
    return new UserCategory("jewAMxi7PiW7icVg6t3RpKFTNER5ZtD8", "#FF0000", "ADMIN");
}

export function getUserCategoryStudent(): UserCategory {
    return new UserCategory("rjyyjhVafQ32YSZ6BkS4A7H3cri46ohi", "#00876C", "Student");
}

export function getUserCategoryInvalid(): UserCategory {
    return new UserCategory("INVALID", "#FF0000", "INVALID");
}

export function getUserAdmin(): User {
    return new User("Bernd", "QiWDFtocwu7wrDF4tqraWX5tqTZk5GTr", "password", getUserCategoryAdmin());
}

export function getUserInvalid(): User {
    return new User("INVALID", "INVALID", "INVALID", getUserCategoryInvalid());
}

export function getPaper(): Paper {
    let authors: Author[] = [{name: "Thomas Bläsius"}]
    return new Paper("S2$649def34f8be52c8b66281af98ae884c09aef38b", "Der Titel eines Artikels", authors,
        2022, "Das ist ein Abstract\nmit Zeilenumbruch", 23, 34, "NCCF",
        "https://papers.org/paper/HJdsfD845hS8wfS7b43d.pdf");
}

export function getPaperInvalid(): Paper {
    return new Paper("INVALID", "INVALID", [], 0, "INVALID", 0,
        0, "INVALID", "INVALID");
}

export interface ResearchResponse {
    id: string;
    title: string;
    startDate: string;
    comment: string;
}

export interface SavedPaperResponse {
    paper: Paper,
    comment: string,
    tags: Tag[],
    research: ResearchResponse,
    saveState: string,
    relevance: number
}

export function getResearch(): Research {
    let user = getUserAdmin();
    return new Research("QiWDFtocwu7wrDF4tqraWX5tqTZk5GTr", "Eine sehr wichtige Recherche", new Date(),
        "Das ist die Beschreibung einer sehr wichtigen Recherche", user);
}

export function getResearchInvalid(): Research {
    return new Research("INVALID", "INVALID", new Date(), "INVALID", getUserAdmin());
}

export function assertResearch(actual: Research, expected: ResearchResponse | Research) {
    expect(actual.id).toBe(expected.id);
    expect(actual.title).toBe(expected.title);
    expect(actual.comment).toBe(expected.comment);
    expect(actual.startDate.toISOString()).toBe(expected.startDate);
}

export function getTag() {
    return new Tag("24JDXZoef7zJ8h8qZtAyvY8jZZkrtYeD", "Experiment", "#00876C");
}

export function getTagInvalid() {
    return new Tag("INVALID", "INVALID", "INVALID");
}

export function assertTag(actual: Tag, expected: Tag) {
    expect(actual.id).toBe(expected.id);
    expect(actual.name).toBe(expected.name);
    expect(actual.color).toBe(expected.color);
}

export function assertTags(actual: Tag[], expected: Tag[]) {
    expect(actual.length).toBe(expected.length);
    for (let i = 0; i < actual.length; i++) {
        assertTag(actual[i], expected[i]);
    }
}

export function assertPaper(actual: Paper, expected: Paper){
    expect(actual.paperId).toBe(expected.paperId);
    expect(actual.title).toBe(expected.title);
    assertAuthors(actual.authors, expected.authors);
    expect(actual.year).toBe(expected.year);
    expect(actual.abstract).toBe(expected.abstract);
    expect(actual.citationCount).toBe(expected.citationCount);
    expect(actual.referenceCount).toBe(expected.referenceCount);
    expect(actual.venue).toBe(expected.venue);
    expect(actual.pdfUrl).toBe(expected.pdfUrl);
}

export function assertSavedPaper(actual: SavedPaper, expected: SavedPaperResponse | SavedPaper) {
    assertPaper(actual.paper, expected.paper);
    expect(actual.comment).toBe(expected.comment);
    assertTags(actual.tags, expected.tags);
    assertResearch(actual.research, expected.research);
    expect(actual.saveState).toBe(expected.saveState);
    expect(actual.relevance).toBe(expected.relevance);
}

export function assertAuthor(actual: Author, expected: Author){
    expect(actual.name).toBe(expected.name);
}

export function assertAuthors(actual: Author[], expected: Author[]){
    expect(actual.length).toBe(expected.length);
    for(let i = 0; i < actual.length; i++){
        assertAuthor(actual[i], expected[i]);
    }
}

/* c8 ignore stop */
