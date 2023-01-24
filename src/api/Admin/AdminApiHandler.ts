import BasicApiHandler from "../BasicApiHandler";
import { AdminApiCaller } from "./AdminApiCaller";

import type { Organizer } from "@/model/Organizer";
import type { UserCategory } from "@/model/UserCategory";
import type { User } from "@/model/User";

export class AdminApiHandler {
    public static getUsers(organizers: Organizer[]) {
        AdminApiCaller.getUsers(JSON.stringify(organizers))
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            })
    }

    public static createUser(username: string, password: string, userCategory: UserCategory) {
        AdminApiCaller.createUser(username, password, JSON.stringify(userCategory))
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static updateUser(user: User, username: string, password: string, userCategory: UserCategory) {
        AdminApiCaller.updateUser(user.userId, username, password, JSON.stringify(userCategory))
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static deleteUser(user: User) {
        AdminApiCaller.deleteUser(user.userId)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static getUserCategories() {
        AdminApiCaller.getUserCategories()
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static createUserCategory(name: string, color: string) {
        AdminApiCaller.createUserCategory(name, color)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static updateUserCategory(userCategory: UserCategory, name: string, color: string) {
        AdminApiCaller.updateUserCategory(userCategory.id, name, color)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static deleteUserCategory(userCategory: UserCategory) {
        AdminApiCaller.deleteUserCategory(userCategory.id)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }
}