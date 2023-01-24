import { defineStore } from "pinia";

import { User } from "@/model/User";
import { UserCategory } from "@/model/UserCategory";

export const useCurrentUserStore = defineStore('currentUser', {
    state: (): { user: User } => ({
        user: new User("username", "userId", "password", new UserCategory("id", "color", "name")),
    }),
    getters: {
        getUser(state) {
            return state.user;
        }
    },
    actions: {
        setCurrentUser(user: User) {
            this.user = user;
        }
    }
});
