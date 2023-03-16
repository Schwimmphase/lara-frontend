import {beforeEach, describe, expect, test} from "vitest"

import MockAdapter from "axios-mock-adapter";
import BasicApiCaller from "@/api/BasicApiCaller";
import {AuthApiHandler} from "@/api/Auth/AuthApiHandler";

import loginAdmin from "@/test/unit-tests/backend-mock/auth/loginAdmin.json";
import loginUser from "@/test/unit-tests/backend-mock/auth/loginUser.json";
import type {User} from "@/model/User";

const mock = new MockAdapter(BasicApiCaller.axiosInstance);

interface AuthReturn {
    token: string
    user: {
        username: string,
        userId: string,
        userCategory: string
    }
}

describe("AuthApiHandler", () => {
    beforeEach(() => {
        mock.reset();
    });
    test("login as admin", async () => {
        let json: AuthReturn = loginAdmin;

        mock.onPost("/login", { "username": "Bernd", "password": "password" }).reply(200, json);

        let [token, user] = await AuthApiHandler.login("Bernd", "password");
        assertAuthReturn(token, user, json);
    });
    test("login as user", async () => {
        let json: AuthReturn = loginUser;

        mock.onPost("/login", { "username": "Sebastian", "password": "password" }).reply(200, json);

        let [token, user] = await AuthApiHandler.login("Sebastian", "password");
        assertAuthReturn(token, user, json);
    });
    test("login as user with wrong password", async () => {
        mock.onPost("/login", { "username": "Sebastian", "password": "INVALID" }).reply(401);

        let result: any[] = await AuthApiHandler.login("Sebastian", "INVALID");
        expect(result.length).toBe(0);
    });
})

function assertAuthReturn(token: String, user: User, json: AuthReturn): void {
    expect(token).toBe(json.token);
    expect(user.username).toBe(json.user.username);
    expect(user.userId).toBe(json.user.userId);
    expect(user.userCategory).toBe(json.user.userCategory);
}