import { AuthApiCaller } from "./AuthApiCaller";
import type { User } from "@/model/User";
import { useCurrentUserStore } from "@/stores/currentUser";
import router from "@/router";

export class AuthApiHandler {
    public static login(userId: string, password: string) { // TODO: (backend) response needs to contain user object to be able to store current user to display username on home page
        AuthApiCaller.login(userId, password)
            .then(response => {
                // create cookie for token
                let date = new Date();
                date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
                document.cookie = "lara-token=" + response.data + ";expires=" + date.toUTCString() + ";path=/";
                
                // store user & redirect to HomeView
                useCurrentUserStore().setCurrentUser(response.data.user);
                router.push({ name: 'home'}); // TODO: is this ok or move elsewhere?
            });
    }
}
