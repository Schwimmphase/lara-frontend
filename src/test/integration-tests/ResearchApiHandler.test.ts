import {beforeAll, describe, expect, test} from "vitest"

import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";
import {TagApiHandler} from "@/api/Tag/TagApiHandler";

import type {Research} from "@/model/Research";
import type {Paper} from "@/model/Paper";
import type {SavedPaper} from "@/model/SavedPaper";
import type {Tag} from "@/model/Tag";
import {SaveState} from "@/model/SaveState";
import {testPaper1} from "@/model/_testResearch";

import {assertSavedPaper, assertTag} from "@/test/Helper";
import errors from "@/test/unit-tests/backend-mock/research/errors.json";


let research: Research;
let paper = testPaper1;
let savedPaper: SavedPaper;
let tag: Tag;

describe("ResearchApiHandler", () => {
    beforeAll(() => {
        ResearchApiHandler.createResearch("testTitle", "testDescription").then(response => {
            research = response;
            ResearchApiHandler.savePaper(research, testPaper1, SaveState.added);
            ResearchApiHandler.getSavedPapers(research, []).then(papers => {
                savedPaper = papers[0];
            });
            TagApiHandler.createTag(research, "testTag", "#FFFFFF").then(response => {
                tag = response;
            });
            PaperApiHandler.addTag(savedPaper, tag);
        });
    });

    test("getAllResearchesByUser", () => {
        ResearchApiHandler.getAllResearchesByUser().then(researches => {
            expect(researches).toHaveLength(1);
            assertResearch(researches[0], research);
        });
    });

    test("createResearch", () => {
        ResearchApiHandler.createResearch(research.title, research.comment).then(actualResearch => {
            assertResearch(actualResearch, research);
        });
    });

    describe("updateResearch", () => {
        test("valid-arguments", () => {
            ResearchApiHandler.updateResearch(research, "Eine sehr wichtige Recherche",
                "Das ist die Beschreibung einer sehr wichtigen Recherche").then(actualResearch => {
                assertResearch(actualResearch, research);
            });
        });
        test("invalid-id", () => {
            let json: string = errors.researchNotFound;

            ResearchApiHandler.updateResearch(null as unknown as Research, "Eine sehr wichtige Recherche",
                "Das ist die Beschreibung einer sehr wichtigen Recherche").catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
    });

    test("deleteResearch", () => {
        ResearchApiHandler.deleteResearch(research); // only checks if no error is thrown
    });

    describe("savePaper", () => {
        test("valid-arguments", () => {
            ResearchApiHandler.savePaper(research, paper, SaveState.added); // only checks if no error is thrown
        });
        test("invalid-paper", () => {
            let json: string = errors.researchOrPaperNotFound;

            ResearchApiHandler.savePaper(research, null as unknown as Paper, SaveState.added).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
    });

    test("removePaper", () => {
        ResearchApiHandler.removePaper(research, paper); // only checks if no error is thrown
    });

    test("getTags", () => {
        ResearchApiHandler.getTags(research).then(tags => {
            expect(tags).toHaveLength(1);
            assertTag(tags[0], tag);
        });
    });

    test("getSavedPapers", () => {
        ResearchApiHandler.getSavedPapers(research, []).then(savedPapers => {
            expect(savedPapers).toHaveLength(1);
            assertSavedPaper(savedPapers[0], savedPaper);
        });
    });

    describe("get-recommendations/references/citations", () => {
        test("getRecommendations", () => {
            ResearchApiHandler.getRecommendations(research, []).then(recommendations => {
                expect(recommendations).toBeTruthy();
            });
        });
        test("getReferences", () => {
            ResearchApiHandler.getReferences(research, []).then(references => {
                expect(references).toBeTruthy();
            });
        });
        test("getCitations", () => {
            ResearchApiHandler.getCitations(research, []).then(citations => {
                expect(citations).toBeTruthy();
            });
        });
    });

    test("searchByKeywords", () => {
        ResearchApiHandler.searchByKeywords("query", []).then(papers => {
            expect(papers).toBeTruthy();
        });
    });
});

function assertResearch(actual: Research, expected: Research) {
    expect(actual.id).toBe(expected.id);
    expect(actual.title).toBe(expected.title);
    expect(actual.comment).toBe(expected.comment);
    expect(actual.startDate.toISOString()).toBe(expected.startDate);
}
