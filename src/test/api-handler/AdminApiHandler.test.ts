import {describe, test, expect, beforeEach} from "vitest"

import MockAdapter from "axios-mock-adapter";
import BasicApiCaller from "@/api/BasicApiCaller";
import {AdminApiHandler} from "@/api/Admin/AdminApiHandler";
import type {User} from "@/model/User";
import type {UserCategory} from "@/model/UserCategory";
import {
    getUserAdmin,
    getUserCategoryAdmin,
    getUserCategoryInvalid,
    getUserCategoryStudent, getUserInvalid
} from "@/test/api-handler/Helper";

import getUsers from "@/test/backend-mock/admin/getUsers.json";
import createUser from "@/test/backend-mock/admin/createUser.json";
import updateUser from "@/test/backend-mock/admin/updateUser.json";
import getUserCategories from "@/test/backend-mock/admin/getUserCategories.json";
import createUserCategory from "@/test/backend-mock/admin/createUserCategory.json";
import updateUserCategory from "@/test/backend-mock/admin/updateUserCategory.json";
import errors from "@/test/backend-mock/admin/errors.json";

const mock = new MockAdapter(BasicApiCaller.axiosInstance);

interface UserResponse {
    username: string,
    userId: string,
    userCategory: UserCategory
}

describe("AdminApiHandler", () => {
    beforeEach(() => {
        mock.reset();
    });
    test("getUsers", async () => {
        let json: { users: UserResponse[] } = getUsers;

        mock.onGet("/usermanagement", { "organizers": [] }).reply(200, json);

        let users: User[] = await AdminApiHandler.getUsers([]);

        for (let i = 0; i < json.users.length; i++) {
            assertUser(users[i], json.users[i]);
        }
    });
    test("createUser", async () => {
       let json: UserResponse = createUser;

       mock.onPost("/usermanagement", {
           "username": "Bernd",
           "password": "password",
           "usercategory": "ADMIN" }).reply(200, json);

       let userCategory: UserCategory = getUserCategoryAdmin();

       let user: User = await AdminApiHandler.createUser("Bernd", "password", userCategory);

       assertUser(user, json);
    });
    test("createUser with empty password", async () => {
        let json: string = errors.passwordNotNullOrEmpty;

        mock.onPost("/usermanagement", {
            "username": "Bernd",
            "password": "",
            "usercategory": "ADMIN" }).reply(400, { message: json });

        let userCategory: UserCategory = getUserCategoryAdmin();

        await AdminApiHandler.createUser("Bernd", "", userCategory).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("createUser with empty username", async () => {
        let json: string = errors.usernameEmpty;

        mock.onPost("/usermanagement", {
            "username": "",
            "password": "password",
            "usercategory": "ADMIN" }).reply(400, { message: json });

        let userCategory: UserCategory = getUserCategoryAdmin();

        await AdminApiHandler.createUser("", "password", userCategory).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("createUser with invalid user category", async () => {
        let json: string = errors.userCategoryNotFound;

        mock.onPost("/usermanagement", {
            "username": "Bernd",
            "password": "password",
            "usercategory": "INVALID" }).reply(400, { message: json });

        let userCategory: UserCategory = getUserCategoryInvalid();

        await AdminApiHandler.createUser("Bernd", "password", userCategory).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("updateUser", async () => {
        let json: UserResponse = updateUser;

        let user: User = getUserAdmin();
        let userCategory = getUserCategoryStudent();

        mock.onPatch("/usermanagement/" + user.userId, {
            "username": "Gustav",
            "password": "password",
            "usercategory": "Student" }).reply(200, json);

        let updatedUser: User = await AdminApiHandler.updateUser(user, "Gustav", "password", userCategory);

        assertUser(updatedUser, json);
    });
    test("updateUser with user not found", async () => {
        let json: string = errors.userNotFound;

        let user: User = getUserInvalid();
        let userCategory = getUserCategoryStudent();

        mock.onPatch("/usermanagement/" + user.userId, {
            "username": "Gustav",
            "password": "password",
            "usercategory": "Student" }).reply(400, { message: json });

        await AdminApiHandler.updateUser(user, "Gustav", "password", userCategory).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("updateUser with category not found", async () => {
        let json: string = errors.userCategoryOrUserNotFound;

        let user: User = getUserAdmin();
        let userCategory = getUserCategoryInvalid();

        mock.onPatch("/usermanagement/" + user.userId, {
            "username": "Gustav",
            "password": "password",
            "usercategory": "INVALID" }).reply(400, { message: json });

        await AdminApiHandler.updateUser(user, "Gustav", "password", userCategory).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("deleteUser", async () => {

        let user: User = getUserAdmin();

        mock.onDelete("/usermanagement/" + user.userId).reply(200);

        await AdminApiHandler.deleteUser(user); // only test if no error is thrown
    });
    test("getUserCategories", async () => {
        let json: { categories: UserCategory[] } = getUserCategories;

        mock.onGet("/usermanagement/category").reply(200, json);

        let userCategories: UserCategory[] = await AdminApiHandler.getUserCategories();

        for (let i = 0; i < json.categories.length; i++) {
            assertUserCategory(userCategories[i], json.categories[i]);
        }
    });
    test("createUserCategory", async () => {
        let json: UserCategory = createUserCategory;

        mock.onPost("/usermanagement/category", {
            "name": "Student",
            "color": "#00876C" }).reply(200, json);

        let userCategory: UserCategory = await AdminApiHandler.createUserCategory("Student", "#00876C");

        assertUserCategory(userCategory, json);
    });
    test("createUserCategory with name already exists", async () => {
        let json: string = errors.userCategoryAlreadyExists;

        mock.onPost("/usermanagement/category", {
            "name": "Student",
            "color": "#00876C" }).reply(400, { message: json });

        await AdminApiHandler.createUserCategory("Student", "#00876C").catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("createUserCategory with empty name", async () => {
        let json: string = errors.nameEmpty;

        mock.onPost("/usermanagement/category", {
            "name": "",
            "color": "#00876C" }).reply(400, { message: json });

        await AdminApiHandler.createUserCategory("", "#00876C").catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("createUserCategory with empty color", async () => {
        let json: string = errors.colorEmpty;

        mock.onPost("/usermanagement/category", {
            "name": "Student",
            "color": "" }).reply(400, { message: json });

        await AdminApiHandler.createUserCategory("Student", "").catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
    test("updateUserCategory", async () => {
        let json: UserCategory = updateUserCategory;

        let userCategory: UserCategory = getUserCategoryStudent();

        mock.onPatch("/usermanagement/category/" + userCategory.id, {
            "name": "Prof",
            "color": "#4664AA" }).reply(200, json);

        let updatedUserCategory: UserCategory = await AdminApiHandler.updateUserCategory(userCategory,
            "Prof", "#4664AA");

        assertUserCategory(updatedUserCategory, json);
    });
    test("deleteUserCategory", async () => {
        let userCategory: UserCategory = getUserCategoryStudent();

        mock.onDelete("/usermanagement/category/" + userCategory.id).reply(200);

        await AdminApiHandler.deleteUserCategory(userCategory); // only test if no error is thrown
    });
    test("deleteUserCategory with user has category", async () => {
        let json: string = errors.userCategoryNotDeleteBecauseUser;

        let userCategory: UserCategory = getUserCategoryStudent();

        mock.onDelete("/usermanagement/category/" + userCategory.id).reply(400, { message: json });

        await AdminApiHandler.deleteUserCategory(userCategory).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });
});

function assertUser(actual: User, expected: UserResponse): void {
    expect(actual.username).toBe(expected.username);
    expect(actual.userId).toBe(expected.userId);
    assertUserCategory(actual.userCategory, expected.userCategory);
}

function assertUserCategory(actual: UserCategory, expected: UserCategory): void {
    expect(actual.name).toBe(expected.name);
    expect(actual.id).toBe(expected.id);
    expect(actual.color).toBe(expected.color);
}