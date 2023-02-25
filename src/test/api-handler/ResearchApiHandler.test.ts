import {beforeEach, describe, expect, test} from "vitest"

import MockAdapter from "axios-mock-adapter";
import BasicApiCaller from "@/api/BasicApiCaller";
import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import type {Research} from "@/model/Research";
import type {SavedPaperResponse} from "@/test/api-handler/Helper";
import {
    assertPaper,
    assertSavedPaper,
    assertTag,
    getPaper,
    getPaperInvalid,
    getResearch,
    getResearchInvalid
} from "@/test/api-handler/Helper";
import {SaveState} from "@/model/SaveState";
import type {Tag} from "@/model/Tag";
import type {Paper} from "@/model/Paper";

import getAllResearchesByUser from "@/test/backend-mock/research/getAllResearchesByUser.json";
import createResearch from "@/test/backend-mock/research/createResearch.json";
import updateResearch from "@/test/backend-mock/research/updateResearch.json";
import getTagsOfResearch from "@/test/backend-mock/research/getTagsOfResearch.json";
import getPapersOfResearch from "@/test/backend-mock/research/getPapersOfResearch.json";
import getRecommendationsOfResearch from "@/test/backend-mock/research/getRecommendationsOfResearch.json";
import searchByKeywords from "@/test/backend-mock/research/searchByKeywords.json";
import errors from "@/test/backend-mock/research/errors.json";

const mock = new MockAdapter(BasicApiCaller.axiosInstance);

interface ResearchResponse {
    id: string,
    title: string,
    comment: string,
    startDate: string
}

describe("ResearchApiHandler", () => {
    beforeEach(() => {
        mock.reset();
    });
    test("getAllResearchesByUser", async () => {
        let json: { researches: ResearchResponse[] } = getAllResearchesByUser;

        mock.onGet("/research").reply(200, json);

        let researches = await ResearchApiHandler.getAllResearchesByUser();

        expect(researches.length).toBe(json.researches.length);
        assertResearch(researches[0], json.researches[0]);
    });
    test("createResearch", async () => {
        let json: ResearchResponse = createResearch;

        let research = getResearch();

        mock.onPost("/research").reply(200, json);

        let actualResearch = await ResearchApiHandler.createResearch(research.title, research.comment);

        assertResearch(actualResearch, json);
    });
    test("updateResearch", async () => {
        let json: ResearchResponse = updateResearch;

        let research = getResearch();

        mock.onPatch("/research/" + research.id).reply(200, json);

        let actualResearch = await ResearchApiHandler.updateResearch(research, "Eine sehr wichtige Recherche",
            "Das ist die Beschreibung einer sehr wichtigen Recherche");

        assertResearch(actualResearch, json);
    });
    test("updateResearch with invalid id", async () => {
        let json: string = errors.researchNotFound;

        let research = getResearchInvalid();

        mock.onPatch("/research/" + research.id).reply(403, {message: json});

        await ResearchApiHandler.updateResearch(research, "Eine sehr wichtige Recherche",
            "Das ist die Beschreibung einer sehr wichtigen Recherche").catch(reason => {
                expect(reason.message).toBe(json);
        });
    });
    test("updateResearch with research not owned by user", async () => {
        let json: string = errors.researchNotOwned;

        let research = getResearchInvalid();

        mock.onPatch("/research/" + research.id).reply(403, {message: json});

        await ResearchApiHandler.updateResearch(research, "Eine sehr wichtige Recherche",
            "Das ist die Beschreibung einer sehr wichtigen Recherche").catch(reason => {
                expect(reason.message).toBe(json);
        });
    });
    test("deleteResearch", async () => {
        let research = getResearch();

        mock.onDelete("/research/" + research.id).reply(200);

        await ResearchApiHandler.deleteResearch(research); // only checks if no error is thrown
    });
    test("savePaper", async () => {
        let research = getResearch();
        let paper = getPaper();

        mock.onPut("/research/" + research.id + "/paper").reply(200);

        await ResearchApiHandler.savePaper(research, paper, SaveState.added); // only checks if no error is thrown
    });
    test("savePaper with invalid id", async () => {
        let json: string = errors.researchOrPaperNotFound;

        let research = getResearchInvalid();
        let paper = getPaperInvalid();

        mock.onPut("/research/" + research.id + "/paper").reply(403, {message: json});

        await ResearchApiHandler.savePaper(research, paper, SaveState.added).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("savePaper with research not owned by user", async () => {
        let json: string = errors.researchOrPaperNotOwned;

        let research = getResearchInvalid();
        let paper = getPaperInvalid();

        mock.onPut("/research/" + research.id + "/paper").reply(403, {message: json});

        await ResearchApiHandler.savePaper(research, paper, SaveState.added).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("savePaper with cache error", async () => {
        let json: string = errors.cache;

        let research = getResearchInvalid();
        let paper = getPaperInvalid();

        mock.onPut("/research/" + research.id + "/paper").reply(500, {message: json});

        await ResearchApiHandler.savePaper(research, paper, SaveState.added).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("removePaper", async () => {
        let research = getResearch();
        let paper = getPaper();

        mock.onDelete("/research/" + research.id + "/paper").reply(200);

        await ResearchApiHandler.removePaper(research, paper); // only checks if no error is thrown
    });
    test("getTags", async () => {
        let json: { tags: Tag[] } = getTagsOfResearch;

        let research = getResearch();

        mock.onGet("/research/" + research.id + "/tags").reply(200, json);

        let tags = await ResearchApiHandler.getTags(research);

        expect(tags.length).toBe(json.tags.length);
        assertTag(tags[0], json.tags[0]);
    });
    test("getSavedPapers", async () => {
        let json: { papers: SavedPaperResponse[] } = getPapersOfResearch;

        let research = getResearch();

        mock.onPost("/research/" + research.id + "/papers").reply(200, json);

        let savedPapers = await ResearchApiHandler.getSavedPapers(research, []);

        expect(savedPapers.length).toBe(json.papers.length);
        assertSavedPaper(savedPapers[0], json.papers[0]);
    });
    test("getSavedPapers with cache error", async () => {
        let json: string = errors.loadCache;

        let research = getResearch();

        mock.onPost("/research/" + research.id + "/papers").reply(400, {message: json});

        await ResearchApiHandler.getSavedPapers(research, []).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("getRecommendations", async () => {
        let json: { recommendations: Paper[] } = getRecommendationsOfResearch;

        let research = getResearch();

        mock.onPost("/research/" + research.id + "/recommendations").reply(200, json);

        let recommendations = await ResearchApiHandler.getRecommendations(research, []);

        expect(recommendations.length).toBe(json.recommendations.length);
        assertPaper(recommendations[0], json.recommendations[0]);
    });
    test("getReferences", async () => {
        let json: { recommendations: Paper[] } = getRecommendationsOfResearch;

        let research = getResearch();

        mock.onPost("/research/" + research.id + "/recommendations").reply(200, json);

        let references = await ResearchApiHandler.getReferences(research, []);

        expect(references.length).toBe(json.recommendations.length);
        assertPaper(references[0], json.recommendations[0]);
    });
    test("getCitations", async () => {
        let json: { recommendations: Paper[] } = getRecommendationsOfResearch;

        let research = getResearch();

        mock.onPost("/research/" + research.id + "/recommendations").reply(200, json);

        let citations = await ResearchApiHandler.getCitations(research, []);

        expect(citations.length).toBe(json.recommendations.length);
        assertPaper(citations[0], json.recommendations[0]);
    });
    test("searchByKeywords", async () => {
        let json: { papers: Paper[] } = searchByKeywords;

        mock.onPost("/research/search").reply(200, json);

        let papers = await ResearchApiHandler.searchByKeywords("query", []);

        expect(papers.length).toBe(json.papers.length);
        assertPaper(papers[0], json.papers[0]);
    });
});

function assertResearch(actual: Research, expected: ResearchResponse) {
    expect(actual.id).toBe(expected.id);
    expect(actual.title).toBe(expected.title);
    expect(actual.comment).toBe(expected.comment);
    expect(actual.startDate.toISOString()).toBe(expected.startDate);
}