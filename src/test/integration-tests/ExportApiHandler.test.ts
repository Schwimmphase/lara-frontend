import {afterAll, beforeAll, describe, expect, test} from "vitest"

import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import {ExportApiHandler} from "@/api/Export/ExportApiHandler";

import type {Research} from "@/model/Research";
import type {Paper} from "@/model/Paper";
import {SaveState} from "@/model/SaveState";

import errors from "@/test/unit-tests/backend-mock/export/errors.json";
import {testPaper1} from "@/model/_testResearch";


let research: Research;

describe("ExportApiHandler", () => {
    beforeAll(() => {
        ResearchApiHandler.createResearch("testTitle", "testDescription").then(response => {
            research = response;
            ResearchApiHandler.savePaper(research, testPaper1, SaveState.enqueued);
            ResearchApiHandler.savePaper(research, testPaper1, SaveState.added);
            ResearchApiHandler.savePaper(research, testPaper1, SaveState.hidden);
        });
    });
    afterAll(() => {
       ResearchApiHandler.deleteResearch(research);
    });

    describe("export research", () => {
        test("valid id", () => {
            ExportApiHandler.exportResearch(research, []).then(exportString => {
                expect(exportString.split("\n")).toHaveLength(3); // two new lines per paper
            });
        });
        test("wrong id", () => {
            let json: string = errors.researchNotOwned;

            ExportApiHandler.exportResearch(null as unknown as Research, []).catch(reason => {
               expect(reason.message).toBe(json);
            });
        });
    });

    describe("export paper", () => {
        test("valid id", () => {
            ResearchApiHandler.getSavedPapers(research, []).then(papers => {
                ExportApiHandler.exportPaper(papers[0].paper).then(exportString => {
                    expect(exportString.split("\n")).toHaveLength(3); // two new lines per paper
                });
            });
        });
        test("wrong id", () => {
            let json: string = errors.paperNotFound;

            ExportApiHandler.exportPaper(null as unknown as Paper).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
    });
});