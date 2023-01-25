import { defineStore } from "pinia";

import { User } from "@/model/User";
import { UserCategory } from "@/model/UserCategory";

export const useCurrentUserStore = defineStore('currentUser', {
    state: (): { currentUser: User } => ({
        currentUser: new User("username", "userId", "password", new UserCategory("id", "color", "name"))
    }),
    getters: {
        getCurrentUser(state) {
            return state.currentUser;
        }
    },
    actions: {
        setCurrentUser(currentUser: User) {
            this.currentUser = currentUser;
        }
    }
});
