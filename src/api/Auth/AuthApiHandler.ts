import { AuthApiCaller } from "./AuthApiCaller";
import BasicApiHandler from "../BasicApiHandler";
import type { User } from "@/model/User";

export class AuthApiHandler {
    public static async login(userId: string, password: string): Promise<any[]> {
        const response = await AuthApiCaller.login(userId, password);
        let data = BasicApiHandler.tryParseJson(response.data)
        let tokenAndUser: (string|User)[] = [];
        tokenAndUser[0] = data.token;
        tokenAndUser[1] = BasicApiHandler.buildUser(data.user);
        return tokenAndUser;
    }
}
