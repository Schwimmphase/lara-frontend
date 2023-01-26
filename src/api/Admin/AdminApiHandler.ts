import BasicApiHandler from "../BasicApiHandler";
import { AdminApiCaller } from "./AdminApiCaller";

import type { Organizer } from "@/model/Organizer";
import { UserCategory } from "@/model/UserCategory";
import { User } from "@/model/User";
import { plainToInstance } from "class-transformer";

export class AdminApiHandler {
    public static async getUsers(organizers: Organizer[]): Promise<unknown[]> {
        const response = await AdminApiCaller.getUsers(JSON.stringify(organizers));
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(User.constructor(), data);
    }

    public static async createUser(username: string, password: string, userCategory: UserCategory): Promise<unknown[]> {
        const response = await AdminApiCaller.createUser(username, password, JSON.stringify(userCategory));
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(User.constructor(), data);
        
    }

    public static async updateUser(user: User, username: string, password: string, userCategory: UserCategory): Promise<void> {
        await AdminApiCaller.updateUser(user.userId, username, password, JSON.stringify(userCategory));
    }

    public static async deleteUser(user: User): Promise<void> {
        await AdminApiCaller.deleteUser(user.userId);
    }

    public static async getUserCategories(): Promise<unknown[]> {
        const response = await AdminApiCaller.getUserCategories();
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(UserCategory.constructor(), data);
    }

    public static async createUserCategory(name: string, color: string): Promise<void> {
        await AdminApiCaller.createUserCategory(name, color);
    }

    public static async updateUserCategory(userCategory: UserCategory, name: string, color: string): Promise<void> {
        await AdminApiCaller.updateUserCategory(userCategory.id, name, color);
    }

    public static async deleteUserCategory(userCategory: UserCategory): Promise<void> {
        await AdminApiCaller.deleteUserCategory(userCategory.id);
    }
}
