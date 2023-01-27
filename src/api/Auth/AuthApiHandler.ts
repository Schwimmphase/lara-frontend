import { AuthApiCaller } from "./AuthApiCaller";
import BasicApiHandler from "../BasicApiHandler";

export class AuthApiHandler {
    public static async login(userId: string, password: string): Promise<unknown[]> {
        const response = await AuthApiCaller.login(userId, password);
        return BasicApiHandler.tryParseJson(response.data);
    }
}
