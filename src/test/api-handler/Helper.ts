import {User} from "@/model/User";
import {UserCategory} from "@/model/UserCategory";
import {Paper} from "@/model/Paper";
import type {Author} from "@/model/Author";
import {Research} from "@/model/Research";
import {expect} from "vitest";
import {Tag} from "@/model/Tag";

export function getUserCategoryAdmin(): UserCategory {
    return new UserCategory("jewAMxi7PiW7icVg6t3RpKFTNER5ZtD8", "#FF0000", "ADMIN");
}

export function getUserCategoryStudent(): UserCategory {
    return new UserCategory("rjyyjhVafQ32YSZ6BkS4A7H3cri46ohi", "#00876C", "Student");
}

export function getUserAdmin(): User {
    return new User("Bernd", "QiWDFtocwu7wrDF4tqraWX5tqTZk5GTr", "password", getUserCategoryAdmin());
}

export function getPaper(): Paper {
    let authors: Author[] = [{name: "Thomas Bläsius"}]
    return new Paper("S2$649def34f8be52c8b66281af98ae884c09aef38b", "Der Titel eines Artikels", authors,
        2022, "Das ist ein Abstract\nmit Zeilenumbruch", 23, 34, "NCCF",
        "https://papers.org/paper/HJdsfD845hS8wfS7b43d.pdf");
}

export interface ResearchResponse {
    id: string;
    title: string;
    startDate: string;
    comment: string;
}

export function getResearch(): Research {
    let user = getUserAdmin();
    return new Research("QiWDFtocwu7wrDF4tqraWX5tqTZk5GTr", "Eine sehr wichtige Recherche", new Date(),
        "Das ist die Beschreibung einer sehr wichtigen Recherche", user);
}

export function assertResearch(actual: Research, expected: ResearchResponse) {
    expect(actual.id).toBe(expected.id);
    expect(actual.title).toBe(expected.title);
    expect(actual.comment).toBe(expected.comment);
    expect(actual.startDate.toISOString()).toBe(expected.startDate);
}

export function getTag() {
    return new Tag("24JDXZoef7zJ8h8qZtAyvY8jZZkrtYeD", "Experiment", "#00876C");
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