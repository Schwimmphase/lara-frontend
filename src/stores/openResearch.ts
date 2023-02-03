import { defineStore } from "pinia";

import type { SavedPaper } from "../model/SavedPaper";
import type { Research } from "../model/Research";

export const useOpenResearchStore = defineStore('openResearch', {
    state: (): { openResearch: Research | undefined, researchPapers: SavedPaper[] } => ({
        openResearch: undefined,
        researchPapers: []
    }),
    getters: {
        getResearchPapers(state) {
            return state.researchPapers;
        },
        getResearch(state) {
            return state.openResearch;
        }
    },
    actions: {
        setOpenResearch(research: Research) {
            this.openResearch = research;
        },
        setResearchPapers(researchPapers: SavedPaper[]) {
            this.researchPapers = researchPapers;
        },
        resetStore() {
            this.$reset();
        }
    },
    persist: true
});