import {describe, expect, test} from "vitest"

import {AdminApiHandler} from "@/api/Admin/AdminApiHandler";

import type {UserCategory} from "@/model/UserCategory";
import type {User} from "@/model/User";

import errors from "@/test/unit-tests/backend-mock/admin/errors.json";


let testUserCategory: UserCategory;
let testUser: User;

describe("AdminApiHandler", async () => {
    document.cookie = "lara-token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiQWRtaW4iLCJhZG1pbiI6dHJ1ZSwiZXhwIjoxNjgxNDc1MDgyLCJpYXQiOjE2Nzg4ODMwODJ9.YdRCpy3sTRK2zA7_SHG87-w3Wy44A5wLIBe5oEZoYo0Twu5Mig35svPZCpSqQWeOn3dL4qSgpPPNcoUwLpkPOLoDRat_M-WMYd3XEWEb16AzuX-pqvbjM8qvYj67q8F0XVOMeQ3j1XeXnjo2wgMHKAfOKNaQMQ-go9MZFvXomEba5tOvxBDhcylR9ZphPozIAytVDvX0ljDgU5G9i1lBnRHPXWXtzrcwOd3naQzcVlf5tQeS-30nzqOlAxAJXpq8twT1H4DVzbffsOXqy8GJ-t46SUWotN8QEz6RhogNahvMx8OK_awLVrhvmLAmDgCfM-pw9Yqp_99PczU7T1CV9A";

    describe("createUserCategory", () => {
        test("empty-name", () => {
            let json: string = errors.nameEmpty;

            AdminApiHandler.createUserCategory("", "#00876C").catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
        test("empty-color", () => {
            let json: string = errors.colorEmpty;

            AdminApiHandler.createUserCategory("userCategoryName", "").catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
        test("valid-arguments", () => {
            AdminApiHandler.createUserCategory("userCategoryName", "#00876C").then(userCategory => {
                testUserCategory = userCategory;
                expect(testUserCategory).toBeTruthy();
            });
        });
        test("name-already-exists", () => {
            let json: string = errors.userCategoryAlreadyExists;

            AdminApiHandler.createUserCategory(testUserCategory.name, testUserCategory.color).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
    });

    describe("createUser", () => {
        test("empty-password", () => {
            let json: string = errors.passwordNotNullOrEmpty;

            AdminApiHandler.createUser("Bernd", "", testUserCategory).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
        test("empty-username", () => {
            let json: string = errors.usernameEmpty;

            AdminApiHandler.createUser("", "password", testUserCategory).catch(reason => {
                expect(reason.message).toBe(json);
            });
        });
        test("invalid-user-category", () => {
            let json: string = errors.userCategoryNotFound;

            AdminApiHandler.createUser("Bernd", "password", null as unknown as UserCategory)
                .catch(reason => {
                    expect(reason.message).toBe(json);
                }
            );
        });
        test("valid-arguments", () => {
            AdminApiHandler.createUser("Bernd", "password", testUserCategory).then(user => {
                testUser = user;
                expect(testUser).toBeTruthy();
            });
        });
    });

    test("getUserCategories", () => {
        AdminApiHandler.getUserCategories().then(userCategories => {
            let userCategoryFound = userCategories.find(userCategory => {
                return userCategory.id === testUserCategory.id;
            });
            expect(userCategoryFound).toBeTruthy();
        });

    });

    test("getUsers", () => {
        AdminApiHandler.getUsers([]).then(users => {
            let userFound = users.find(user => {
                return user.userId === testUser.userId;
            });
            expect(userFound).toBeTruthy();
        });
    });

    test("updateUserCategory", () => {
        let newName = "Prof";
        let newColor = "#4664AA";

        AdminApiHandler.updateUserCategory(testUserCategory, newName, newColor).then(userCategory => {
            testUserCategory = userCategory;
            expect(testUserCategory.id).toBe(testUserCategory.id);
            expect(testUserCategory.name).toBe(newName);
            expect(testUserCategory.color).toBe(newColor);
        });
    });

    describe("updateUser", () => {
        test("valid-arguments", () => {
            let newUsername = "Gustav";
            let newPassword = "password";

            AdminApiHandler.updateUser(testUser, newUsername, newPassword, testUserCategory).then(updatedUser => {
                expect(updatedUser.userId).toBe(testUser.userId);
                expect(updatedUser.username).toBe(newUsername);
                expect(updatedUser.password).toBe(newPassword);
                expect(updatedUser.userCategory).toBe(testUserCategory);
            });
        });
        test("invalid-user", () => {
            let json: string = errors.userNotFound;

            let newUsername = "Gustav";
            let newPassword = "password";

            AdminApiHandler.updateUser(null as unknown as User, newUsername, newPassword, testUserCategory)
                .catch(reason => {
                    expect(reason.message).toBe(json);
                }
            );
        });
        test("invalid-userCategory", () => {
            let json: string = errors.userCategoryOrUserNotFound;

            let newUsername = "Gustav";
            let newPassword = "password";

            AdminApiHandler.updateUser(testUser, newUsername, newPassword, null as unknown as UserCategory)
                .catch(reason => {
                    expect(reason.message).toBe(json);
                }
            );
        });
    });

    test("deleteUserCategory-with-user-has-category", () => {
        let json: string = errors.userCategoryNotDeleteBecauseUser;

        AdminApiHandler.deleteUserCategory(testUserCategory).catch(reason => {
            expect(reason.message).toBe(json);
        });
    });

    test("deleteUser", () => {
        AdminApiHandler.deleteUser(testUser); // only test if no error is thrown
    });

    test("deleteUserCategory-with-valid-arguments", () => {
        AdminApiHandler.deleteUserCategory(testUserCategory); // only test if no error is thrown
    });
});
