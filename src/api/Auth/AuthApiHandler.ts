import { AuthApiCaller } from "./AuthApiCaller";
import router from "@/router";

export class AuthApiHandler {
    public static login(userId: string, password: string) { // change userId to user (of type User)
        AuthApiCaller.login(userId, password)
            .then(response => {
                console.log("response data: " + response.data);
                let date = new Date();
                date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
                document.cookie = "lara-token=" + response.data + ";expires=" + date.toUTCString() + ";path=/";
                router.push({ name: 'home'}); // TODO: move elsewhere
            });
    }
}
