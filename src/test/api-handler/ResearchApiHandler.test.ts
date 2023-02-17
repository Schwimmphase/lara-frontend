import {describe, test, expect, beforeEach} from "vitest"

import MockAdapter from "axios-mock-adapter";
import BasicApiCaller from "@/api/BasicApiCaller";

const mock = new MockAdapter(BasicApiCaller.axiosInstance);

describe("ResearchApiHandler", () => {
    beforeEach(() => {
        mock.reset();
    });
});