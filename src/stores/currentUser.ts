import { defineStore } from "pinia";
import type { User } from "@/model/User";

export const useCurrentUserStore = defineStore('currentUser', {
    state: (): { currentUser: User | null, isAdmin: boolean } => ({
        currentUser: null,
        isAdmin: false
    }),
    getters: {
        getCurrentUser(state) {
            return state.currentUser;
        },
        getIsAdmin(state) {
            return state.isAdmin;
        }
    },
    actions: {
        setCurrentUser(currentUser: User) {
            this.currentUser = currentUser;
        },
        setAdmin(isAdmin: boolean) {
            this.isAdmin = isAdmin;
        },
        resetStore() {
            this.$reset();
        }
    },
    persist: true
});
