import {describe, expect, test} from "vitest"

import {AuthApiHandler} from "@/api/Auth/AuthApiHandler";

import {User} from "@/model/User";


describe("AuthApiHandler", () => {
    test("valid arguments", () => {
        AuthApiHandler.login("Admin", "password").then(([token, user]) => {
            expect(token).toBeInstanceOf(String);
            expect(token.split(".")).toHaveLength(3);
            expect(user).toBeInstanceOf(User);
       });
    });
    test("wrong password", () => {
        AuthApiHandler.login("Admin", "INVALID").then(result => {
            expect(result).toHaveLength(0);
        });
    });
})
