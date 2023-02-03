import BasicApiHandler from "../BasicApiHandler";
import { AuthApiCaller } from "./AuthApiCaller";

export class AuthApiHandler {
    public static async login(userId: string, password: string): Promise<string> {
        const response = await AuthApiCaller.login(userId, password);
        return BasicApiHandler.tryParseJson(response.data);
    }
}
