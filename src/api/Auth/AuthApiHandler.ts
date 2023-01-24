import router from "@/router";
import { AuthApiCaller } from "./AuthApiCaller";

export class AuthApiHandler {
    public static login(userId: string, password: string) { // TODO: change userId to user (of type User)?
        AuthApiCaller.login(userId, password)
            .then(response => {
                let date = new Date();
                date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
                document.cookie = "lara-token=" + response.data.token + ";expires=" + date.toUTCString() + ";path=/";
                router.push({ name: 'home'}); // TODO: is this ok or move elsewhere?
            });
    }
}
