import { defineStore } from 'pinia';

import type { OpenPaper } from './model/OpenPaper';

// Store for the currently opened paper
export const useOpenPaperStore = defineStore('openPaper', {
    state: (): { paper: OpenPaper | null } => ({
        paper: null
    }),

    getters: {
        getPaper(state) {
            return state.paper;
        }
    },

    actions: {
        setPaper(paper: OpenPaper) {
            this.paper = paper;
        }
    }
});