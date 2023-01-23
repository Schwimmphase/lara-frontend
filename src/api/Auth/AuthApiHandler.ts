import type { User } from "@/model/User";
import BasicApiHandler from "../BasicApiHandler";
import { AuthApiCaller } from "./AuthApiCaller";

export class AuthApiHandler {
    public static login(user: User, password: string) {
        AuthApiCaller.login(user.userId, password)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response .data);
            });
    }
}
