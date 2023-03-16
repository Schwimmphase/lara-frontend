import {beforeAll, describe, expect, test} from "vitest"

import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";
import {TagApiHandler} from "@/api/Tag/TagApiHandler";

import type {Research} from "@/model/Research";
import type {SavedPaper} from "@/model/SavedPaper";
import type {Tag} from "@/model/Tag";
import {SaveState} from "@/model/SaveState";
import {testPaper1} from "@/model/_testResearch";

import {assertTag} from "@/test/Helper";
import errors from "@/test/unit-tests/backend-mock/tag/errors.json";


let research: Research;
let tag: Tag;
let savedPaper: SavedPaper;

describe("TagApiHandler", () => {
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

    test("createTag", () => {
        TagApiHandler.createTag(research, "Experiment", "#00876C").then(actualTag => {
            assertTag(actualTag, tag);
        });
    });

    describe("updateTag", () => {
        test("valid-arguments", () => {
            TagApiHandler.updateTag(tag, "Meta Analysis", "#4664AA").then(actualTag => {
                assertTag(actualTag, tag);
            });
        });
        test("invalid-tagId", () => {
            let json: string = errors.researchNotOwned;

            TagApiHandler.updateTag(null as unknown as Tag, "Meta Analysis", "#4664AA").catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
    });

    describe("deleteTag", () => {
        test("valid-arguments", () => {
            TagApiHandler.deleteTag(tag); // test if no error is thrown
        });
        test("invalid-tagId", async () => {
            let json: string = errors.researchNotOwned;

            TagApiHandler.deleteTag(null as unknown as Tag).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
    });
});
