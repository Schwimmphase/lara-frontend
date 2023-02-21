import {beforeEach, describe, expect, test} from "vitest"

import MockAdapter from "axios-mock-adapter";
import BasicApiCaller from "@/api/BasicApiCaller";
import {ExportApiHandler} from "@/api/Export/ExportApiHandler";
import type {Research} from "@/model/Research";
import type {Paper} from "@/model/Paper";
import {getPaper, getPaperInvalid, getResearch, getResearchInvalid} from "@/test/api-handler/Helper";

import exportResearch from "@/test/backend-mock/export/exportResearch.json";
import exportPaper from "@/test/backend-mock/export/exportPaper.json";
import errors from "@/test/backend-mock/export/errors.json";

const mock = new MockAdapter(BasicApiCaller.axiosInstance);

describe("ExportApiHandler", () => {
    beforeEach(() => {
        mock.reset();
    });
    test("exportResearch", async () => {
        let json: { export: string } = exportResearch;

        let research: Research = getResearch();

        mock.onPost("/export/research/" + research.id, { "organizers": [] }).reply(200, json);

        let exportString: string = await ExportApiHandler.exportResearch(research, []);

        expect(exportString).toBe(json.export);
    });
    test("exportResearch with wrong id", async () => {
        let json: string = errors.researchNotOwned;

        let research: Research = getResearchInvalid();

        mock.onPost("/export/research/" + research.id, { "organizers": [] })
            .reply(403, { message: json});

        await ExportApiHandler.exportResearch(research, []).catch(reason => {
           expect(reason.message).toBe(json);
        });
    });
    test("exportPaper", async () => {
        let json: { export: string } = exportPaper;

        let paper: Paper = getPaper();

        mock.onGet("/export/paper/" + paper.paperId).reply(200, json);

        let exportString: string = await ExportApiHandler.exportPaper(paper);

        expect(exportString).toBe(json.export);
    });
    test("exportPaper with wrong id", async () => {
        let json: string = errors.paperNotFound;

        let paper: Paper = getPaperInvalid();

        mock.onGet("/export/paper/" + paper.paperId).reply(400, { message: json});

        await ExportApiHandler.exportPaper(paper).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
});