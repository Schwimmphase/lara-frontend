import { AuthApiCaller } from "./AuthApiCaller";
import BasicApiHandler from "../BasicApiHandler";
import type { User } from "@/model/User";

export class AuthApiHandler {
    public static async login(userId: string, password: string): Promise<string> {
        const response = await AuthApiCaller.login(userId, password);
        return BasicApiHandler.tryParseJson(response.data);
    }
}
