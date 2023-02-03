import BasicApiHandler from "../BasicApiHandler";
import { AdminApiCaller } from "./AdminApiCaller";

import type { Organizer } from "@/model/Organizer";
import type { UserCategory } from "@/model/UserCategory";
import type { User } from "@/model/User";

export class AdminApiHandler {
    public static async getUsers(organizers: Organizer[]): Promise<User[]> {
        const response = await AdminApiCaller.getUsers(organizers);
        let data = BasicApiHandler.tryParseJson(response.data);
        let users: User[] = []
        for (let user of data) {
            users.push(BasicApiHandler.buildUser(user));
        }
        return users;
    }

    public static async createUser(username: string, password: string, userCategory: UserCategory): Promise<User> {
        const response = await AdminApiCaller.createUser(username, password, userCategory);
        let data = BasicApiHandler.tryParseJson(response.data);
        return BasicApiHandler.buildUser(data);
    }

    public static async updateUser(user: User, username: string, password: string, userCategory: UserCategory): Promise<User> {
        const response = await AdminApiCaller.updateUser(user.userId, username, password, userCategory);
        let data = BasicApiHandler.tryParseJson(response.data);
        return BasicApiHandler.buildUser(data);
    }

    public static async deleteUser(user: User): Promise<void> {
        await AdminApiCaller.deleteUser(user.userId);
    }

    public static async getUserCategories(): Promise<UserCategory[]> {
        const response = await AdminApiCaller.getUserCategories();
        let data = BasicApiHandler.tryParseJson(response.data);
        let userCategories: UserCategory[] = [];
        for (let userCategory of data.userCategories) {
            userCategories.push(BasicApiHandler.buildUserCategory(userCategory));
        }
        return userCategories;
    }

    public static async createUserCategory(name: string, color: string): Promise<UserCategory> {
        const response = await AdminApiCaller.createUserCategory(name, color);
        let data = BasicApiHandler.tryParseJson(response.data);
        return BasicApiHandler.buildUserCategory(data);
    }

    public static async updateUserCategory(userCategory: UserCategory, name: string, color: string): Promise<UserCategory> {
        const response = await AdminApiCaller.updateUserCategory(userCategory.id, name, color);
        let data = BasicApiHandler.tryParseJson(response.data);
        return BasicApiHandler.buildUserCategory(data);
    }

    public static async deleteUserCategory(userCategory: UserCategory): Promise<void> {
        await AdminApiCaller.deleteUserCategory(userCategory.id);
    }
}