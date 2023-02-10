import BasicApiHandler from "../BasicApiHandler";
import { AuthApiCaller } from "./AuthApiCaller";

export class AuthApiHandler {
    public static async login(username: string, password: string): Promise<any[]> {
        const response = await AuthApiCaller.login(username, password);
        if (!response) {
            return [];
        }

        const data = BasicApiHandler.tryParseJson(response.data);
        let token = data.token;
        let user = BasicApiHandler.buildUser(data.user);
        return [token, user];
    }
}
