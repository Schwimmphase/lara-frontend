import { defineStore } from 'pinia';

import type { OpenPaper } from './model/OpenPaper';

// Store for the currently opened paper
export const useOpenPaperStore = defineStore('openPaper', {
    state: (): { paper: OpenPaper | null } => ({
        paper: null
    }),

    getters: {
        getPaper(state) {
            if (state.paper?.saved) {
                return state.paper?.savedPaper;
            }

            return state.paper?.paper;
        }
    },

    actions: {
        setPaper(paper: OpenPaper) {
            this.paper = paper;
        }
    }
});