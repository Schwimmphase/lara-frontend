import { defineStore } from 'pinia';

import type { SavedPaper } from "@/model/SavedPaper";
import type { Paper } from "@/model/Paper";

// Store for the currently opened paper
export const useOpenPaperStore = defineStore('openPaper', {
    state: (): { paper: Paper | SavedPaper | null } => ({
        paper: null
    }),

    getters: {
        getPaper(state) {
            return state.paper;
        }
    },

    actions: {
        setPaper(paper: Paper | SavedPaper) {
            this.paper = paper;
        }
    }
});