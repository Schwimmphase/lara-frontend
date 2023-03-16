import {afterAll, beforeAll, describe, expect, test} from "vitest"

import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";
import {TagApiHandler} from "@/api/Tag/TagApiHandler";

import type {Research} from "@/model/Research";
import type {SavedPaper} from "@/model/SavedPaper";
import type {Paper} from "@/model/Paper";
import type {Tag} from "@/model/Tag";
import {SaveState} from "@/model/SaveState";
import {testPaper1} from "@/model/_testResearch";

import {assertPaper, assertSavedPaper} from "@/test/Helper";
import errors from "@/test/unit-tests/backend-mock/paper/errors.json";


let research: Research;
let paper = testPaper1;
let savedPaper: SavedPaper;
let tag : Tag;

describe("PaperApiHandler", () => {
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
        });
    });
    afterAll(() => {
        ResearchApiHandler.deleteResearch(research);
    });

    describe("getDetails", () => {
        test("from-paper", () => {
            PaperApiHandler.getDetails(paper.paperId, research.id).then(details => {
                assertPaper(details as Paper, paper);
            });

        });
        test("from-paper-invalid-paperId/researchId", () => {
            let json: string = errors.paperNotFound;

            PaperApiHandler.getDetails("", research.id).catch(reason => {
                expect(reason.message).toBe(json);
            });
            PaperApiHandler.getDetails(paper.paperId, "").catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
        test("from-saved-paper", () => {
            PaperApiHandler.getDetails(paper.paperId, research.id).then(details => {
                assertSavedPaper(details as SavedPaper, savedPaper);
            });
        });
        test("from-saved-paper-not-owned-by-user", () => {
            let json: string = errors.paperNotOwned;

            PaperApiHandler.getDetails(paper.paperId, research.id).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
    });

    describe("addTag", () => {
        test("addTag", () => {
            PaperApiHandler.addTag(savedPaper, tag); // test if no error is thrown
        });
        test("addTag-paper-already-having-tag", () => {
            let json: string = errors.paperAlreadyTag;

            PaperApiHandler.addTag(savedPaper, tag).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
        test("addTag-tag-not-owned-by-user", () => {
            let json: string = errors.paperOrTagNotOwned;

            PaperApiHandler.addTag(savedPaper, tag).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
    });

    describe("removeTag", () => {
        test("removeTag", () => {
            PaperApiHandler.removeTag(savedPaper, tag); // test if no error is thrown
        });
        test("removeTag-paper-not--having-tag", () => {
            let json: string = errors.paperNotHasTag;

            PaperApiHandler.removeTag(savedPaper, tag).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
    });

    describe("change-comment-saveState", () => {
        test("changeComment", () => {
            // test if no error is thrown
            PaperApiHandler.changeComment(savedPaper, "Ne der Artikel ist doch nicht so gut");
        });
        test("changeSaveState", () => {
            PaperApiHandler.changeSaveState(savedPaper, SaveState.hidden); // test if no error is thrown
        });
        test("changeRelevance", () => {
            PaperApiHandler.changeRelevance(savedPaper, 1); // test if no error is thrown
        });
    });

    describe("get-recommendations-references-citations", () => {
        test("getRecommendations", () => {
            PaperApiHandler.getRecommendations(paper, []).then(actualRecommendations => {
                expect(actualRecommendations).toHaveLength(1);
                assertPaper(actualRecommendations[0], paper);
            });
        });
        test("getReferences", () => {
            PaperApiHandler.getReferences(paper, []).then(actualReferences => {
                expect(actualReferences).toHaveLength(1);
                assertPaper(actualReferences[0], paper);
            });
        });
        test("getCitations", () => {
            PaperApiHandler.getCitations(paper, []).then(actualCitations => {
                expect(actualCitations).toHaveLength(1);
                assertPaper(actualCitations[0], paper);
            });
        });
    });
});
