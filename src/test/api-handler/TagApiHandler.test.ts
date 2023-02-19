import {beforeEach, describe, test} from "vitest"

import MockAdapter from "axios-mock-adapter";
import BasicApiCaller from "@/api/BasicApiCaller";
import type {Tag} from "@/model/Tag";
import {TagApiHandler} from "@/api/Tag/TagApiHandler";
import {assertTag, getResearch, getTag} from "@/test/api-handler/Helper";

import createTag from "@/test/backend-mock/tag/createTag.json";
import updateTag from "@/test/backend-mock/tag/updateTag.json";

const mock = new MockAdapter(BasicApiCaller.axiosInstance);

describe("TagApiHandler", () => {
    beforeEach(() => {
        mock.reset();
    });
    test("createTag", async () => {
        let json: Tag = createTag;

        let research = getResearch();

        mock.onPost("/tag").reply(200, json);

        let tag = await TagApiHandler.createTag(research, "Experiment", "#00876C");

        assertTag(tag, json);
    });
    test("updateTag", async () => {
        let json: Tag = updateTag;

        let tag = getTag();

        mock.onPatch("/tag/" + json.id).reply(200, json);

        let expectedTag = await TagApiHandler.updateTag(tag, "Meta Analysis", "#4664AA");

        assertTag(expectedTag, json);
    });
    test("deleteTag", async () => {
        let tag = getTag();

        mock.onDelete("/tag/" + tag.id).reply(200);

        await TagApiHandler.deleteTag(tag); // test if no error is thrown
    });
});