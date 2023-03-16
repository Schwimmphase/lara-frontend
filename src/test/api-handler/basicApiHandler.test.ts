import { describe, test, expect } from "vitest";

import {
    testCachedPaper,
    testPaper1,
    testResearch,
    testSavedPaper1,
    testUser,
    testUserCategory1
} from "@/model/_testResearch";
import BasicApiHandler from "@/api/BasicApiHandler";


describe("parseJson", () => {
    test("parse - correct input", () => {
        expect(BasicApiHandler.tryParseJson(testUser)).toEqual(testUser);
    });

    test("parse - false input", () => {
        expect(() => BasicApiHandler.tryParseJson(undefined)).toThrow("Could not parse JSON string");
    });
})

describe("build-methods", () => {
    test("buildUser", () => {
        const user = testUser;
        expect(BasicApiHandler.buildUser(JSON.parse(JSON.stringify(user)))).toStrictEqual(user);
    });

    test("buildUserCategory", () => {
        const userCategory = testUserCategory1;
        expect(BasicApiHandler.buildUserCategory(JSON.parse(JSON.stringify(userCategory)))).toStrictEqual(userCategory);
    });

    test("buildResearch", () => {
        const research = testResearch;
        expect(BasicApiHandler.buildResearch(JSON.parse(JSON.stringify(research)))).toStrictEqual(research);
    });

    test("buildPaper", () => {
        const paper = testPaper1;
        expect(BasicApiHandler.buildPaper(JSON.parse(JSON.stringify(paper)))).toStrictEqual(paper);
    });

    test("buildSavedPaper", () => {
        const savedPaper = testSavedPaper1;
        expect(BasicApiHandler.buildSavedPaper(JSON.parse(JSON.stringify(savedPaper)))).toStrictEqual(savedPaper);
    });

    test("buildCachedPaper", () => {
        const cachedPaper = testCachedPaper;
        expect(BasicApiHandler.buildCachedPaper(JSON.parse(JSON.stringify(cachedPaper)))).toStrictEqual(cachedPaper);
    });
});
