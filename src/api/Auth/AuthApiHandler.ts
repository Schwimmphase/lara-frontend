import { AuthApiCaller } from "./AuthApiCaller";
import router from "@/router";
import BasicApiHandler from "../BasicApiHandler";

export class AuthApiHandler {
    public static async login(userId: string, password: string): Promise<unknown[]> { // TODO: (backend) response needs to contain user object to be able to store current user to display username on home page
        const response = await AuthApiCaller.login(userId, password);
        return BasicApiHandler.tryParseJson(response.data);
    }
}
