import {beforeEach, describe, expect, test} from "vitest"

import MockAdapter from "axios-mock-adapter";
import BasicApiCaller from "@/api/BasicApiCaller";
import type {Paper} from "@/model/Paper";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";
import {SavedPaper} from "@/model/SavedPaper";
import type {SavedPaperResponse} from "@/test/api-handler/Helper";
import {assertPaper, assertSavedPaper, getPaper, getPaperInvalid, getResearch, getTag} from "@/test/api-handler/Helper";
import {SaveState} from "@/model/SaveState";

import getDetailsPaper from "@/test/backend-mock/paper/getDetailsPaper.json";
import getDetailsSavedPaper from "@/test/backend-mock/paper/getDetailsSavedPaper.json";
import getRecommendationsOfPaper from "@/test/backend-mock/paper/getRecommendationsOfPaper.json";
import errors from "@/test/backend-mock/paper/errors.json";

const mock = new MockAdapter(BasicApiCaller.axiosInstance);

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
    test("getDetails from paper with wrong id", async () => {
        let json: string = errors.paperNotFound;

        let paper = getPaperInvalid();

        mock.onGet("/paper/" + paper.paperId).reply(400, { message: json });

        await PaperApiHandler.getDetails(paper.paperId, null).catch(reason => {
           expect(reason.message).toBe(json);
        });
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
    test("getDetails from saved paper not owned by user", async () => {
        let json: string = errors.paperNotOwned;

        let paper = getPaper();
        let research = getResearch();

        mock.onGet("/paper/" + paper.paperId, { params: { "researchId": research.id } })
            .reply(403, { message: json });

        await PaperApiHandler.getDetails(paper.paperId, research.id).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("addTag", async () => {
        let savedPaper = getSavedPaper();
        let tag = getTag();

        mock.onPut("/paper/" + savedPaper.paper.paperId + "/tag").reply(200);

        await PaperApiHandler.addTag(savedPaper, tag); // test if no error is thrown
    });
    test("addTag with paper already having tag", async () => {
        let json: string = errors.paperAlreadyTag;

        let savedPaper = getSavedPaper();
        let tag = getTag();

        mock.onPut("/paper/" + savedPaper.paper.paperId + "/tag")
            .reply(400, { message: json });

        await PaperApiHandler.addTag(savedPaper, tag).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("addTag with tag not owned by user", async () => {
        let json: string = errors.paperOrTagNotOwned;

        let savedPaper = getSavedPaper();
        let tag = getTag();

        mock.onPut("/paper/" + savedPaper.paper.paperId + "/tag")
            .reply(403, { message: json });

        await PaperApiHandler.addTag(savedPaper, tag).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("removeTag", async () => {
        let savedPaper = getSavedPaper();
        let tag = getTag();

        mock.onDelete("/paper/" + savedPaper.paper.paperId + "/tag")
            .reply(200);

        await PaperApiHandler.removeTag(savedPaper, tag); // test if no error is thrown
    });
    test("removeTag with paper not having tag", async () => {
        let json: string = errors.paperNotHasTag;

        let savedPaper = getSavedPaper();
        let tag = getTag();

        mock.onDelete("/paper/" + savedPaper.paper.paperId + "/tag")
            .reply(400, { message: json });

        await PaperApiHandler.removeTag(savedPaper, tag).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("changeComment", async () => {
        let savedPaper = getSavedPaper();

        mock.onPatch("/paper/" + savedPaper.paper.paperId + "/comment",
            { "comment": "Ne der Artikel ist doch nicht so gut" }).reply(200);

        // test if no error is thrown
        await PaperApiHandler.changeComment(savedPaper, "Ne der Artikel ist doch nicht so gut");
    });
    test("changeSaveState", async () => {
        let savedPaper = getSavedPaper();

        mock.onPut("/paper/" + savedPaper.paper.paperId + "/save-state").reply(200);

        await PaperApiHandler.changeSaveState(savedPaper, SaveState.hidden); // test if no error is thrown
    });
    test("changeRelevance", async () => {
        let savedPaper = getSavedPaper();

        mock.onPatch("/paper/" + savedPaper.paper.paperId + "/relevance").reply(200);

        await PaperApiHandler.changeRelevance(savedPaper, 1); // test if no error is thrown
    });
    test("getRecommendations", async () => {
        let json: { recommendations: Paper[] } = getRecommendationsOfPaper;

        let paper = getPaper();

        mock.onPost("/paper/" + paper.paperId + "/recommendations", { "organizers": [] })
            .reply(200, json);

        let actualRecommendations: Paper[] = await PaperApiHandler.getRecommendations(paper, []);

        expect(actualRecommendations.length).toBe(1);
        assertPaper(actualRecommendations[0], paper);
    });
    test("getReferences", async () => {
        let json: { recommendations: Paper[] } = getRecommendationsOfPaper;

        let paper = getPaper();

        mock.onPost("/paper/" + paper.paperId + "/recommendations", { "organizers": [] })
            .reply(200, json);

        let actualReferences: Paper[] = await PaperApiHandler.getReferences(paper, []);

        expect(actualReferences.length).toBe(1);
        assertPaper(actualReferences[0], paper);
    });
    test("getCitations", async () => {
        let json: { recommendations: Paper[] } = getRecommendationsOfPaper;

        let paper = getPaper();

        mock.onPost("/paper/" + paper.paperId + "/recommendations", { "organizers": [] })
            .reply(200, json);

        let actualCitations: Paper[] = await PaperApiHandler.getCitations(paper, []);

        expect(actualCitations.length).toBe(1);
        assertPaper(actualCitations[0], paper);
    });
});

function getSavedPaper(): SavedPaper {
    let paper = getPaper();
    let research = getResearch();
    let tag = getTag();
    return new SavedPaper(paper, research, "Dieser Artikel ist sehr sehr gut. Ich mag diesen Artikel.",
        [tag], 3, SaveState.added);
}