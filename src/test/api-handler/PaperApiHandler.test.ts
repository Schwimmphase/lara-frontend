import {beforeEach, describe, expect, test} from "vitest"

import MockAdapter from "axios-mock-adapter";
import BasicApiCaller from "@/api/BasicApiCaller";
import type {Paper} from "@/model/Paper";
import type {Author} from "@/model/Author";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";
import type {Tag} from "@/model/Tag";
import {SavedPaper} from "@/model/SavedPaper";
import type {ResearchResponse} from "@/test/api-handler/Helper";
import {assertResearch, assertTags, getPaper, getResearch, getTag} from "@/test/api-handler/Helper";

import getDetailsPaper from "@/test/backend-mock/paper/getDetailsPaper.json";
import getDetailsSavedPaper from "@/test/backend-mock/paper/getDetailsSavedPaper.json";
import {SaveState} from "@/model/SaveState";

const mock = new MockAdapter(BasicApiCaller.axiosInstance);

interface SavedPaperResponse {
    paper: Paper,
    comment: string,
    tags: Tag[],
    research: ResearchResponse,
    saveState: string,
    relevance: number
}

describe("PaperApiHandler", () => {
    beforeEach(() => {
        mock.reset();
    });
    test("getDetails from paper", async () => {
        let json: Paper = getDetailsPaper;

        let paper = getPaper();

        mock.onGet("/paper/" + paper.paperId).reply(200, json);

        let detailsPaper: Paper = await PaperApiHandler.getDetails(paper.paperId, null) as Paper;

        assertPaper(detailsPaper, json);
    });
    test("getDetails from saved paper", async () => {
        let json: SavedPaperResponse = getDetailsSavedPaper;

        let paper = getPaper();
        let research = getResearch();

        mock.onGet("/paper/" + paper.paperId, { params: { "researchId": research.id } })
            .reply(200, json);

        let savedPaper: SavedPaper = await PaperApiHandler.getDetails(paper.paperId, research.id) as SavedPaper;

        assertSavedPaper(savedPaper, json);
    });
    test("addTag", async () => {
        let savedPaper = getSavedPaper();
        let tag = getTag();

        mock.onPut("/paper/" + savedPaper.paper.paperId + "/tag").reply(200);

        await PaperApiHandler.addTag(savedPaper, tag); // test if no error is thrown
    });
    test("removeTag", async () => {
        let savedPaper = getSavedPaper();
        let tag = getTag();

        mock.onDelete("/paper/" + savedPaper.paper.paperId + "/tag")
            .reply(200);

        await PaperApiHandler.removeTag(savedPaper, tag); // test if no error is thrown
    });
});

function getSavedPaper(): SavedPaper {
    let paper = getPaper();
    let research = getResearch();
    let tag = getTag();
    return new SavedPaper(paper, research, "Dieser Artikel ist sehr sehr gut. Ich mag diesen Artikel.",
        [tag], 3, SaveState.added);
}

function assertPaper(actual: Paper, expected: Paper){
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

function assertSavedPaper(actual: SavedPaper, expected: SavedPaperResponse) {
    assertPaper(actual.paper, expected.paper);
    expect(actual.comment).toBe(expected.comment);
    assertTags(actual.tags, expected.tags);
    assertResearch(actual.research, expected.research);
    expect(actual.saveState).toBe(expected.saveState);
    expect(actual.relevance).toBe(expected.relevance);
}

function assertAuthor(actual: Author, expected: Author){
    expect(actual.name).toBe(expected.name);
}

function assertAuthors(actual: Author[], expected: Author[]){
    expect(actual.length).toBe(expected.length);
    for(let i = 0; i < actual.length; i++){
        assertAuthor(actual[i], expected[i]);
    }
}