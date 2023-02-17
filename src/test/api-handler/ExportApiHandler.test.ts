import {describe, test, expect, beforeEach} from "vitest"

import MockAdapter from "axios-mock-adapter";
import BasicApiCaller from "@/api/BasicApiCaller";
import {ExportApiHandler} from "@/api/Export/ExportApiHandler";
import type {Research} from "@/model/Research";
import type {Paper} from "@/model/Paper";

import exportResearch from "@/test/backend-mock/export/exportResearch.json";
import {getPaper, getResearch} from "@/test/api-handler/Helper";

const mock = new MockAdapter(BasicApiCaller.axiosInstance);

describe("ExportApiHandler", () => {
    beforeEach(() => {
        mock.reset();
    });
    test("exportResearch", async () => {
        let json: { export: string } = exportResearch;

        let research: Research = getResearch()

        mock.onPost("/export/research/" + research.id, { "organizers": [] }).reply(200, json);

        let exportString: string = await ExportApiHandler.exportResearch(research, []);

        expect(exportString).toBe(json.export);
    });
    test("exportPaper", async () => {
        let json: { export: string } = exportResearch;

        let paper: Paper = getPaper()

        mock.onGet("/export/paper/" + paper.paperId).reply(200, json);

        let exportString: string = await ExportApiHandler.exportPaper(paper);

        expect(exportString).toBe(json.export);
    });
});