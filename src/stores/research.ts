import { defineStore } from "pinia";

import type { SavedPaper } from "../model/SavedPaper";

export const useResearchStore = defineStore('researchPapers', {
    state: (): { researchPapers: SavedPaper[], researchId: string } => ({
        researchPapers: [],
        researchId: "MOIN"
    }),
    getters: {
        getResearchPapers(state) {
            return state.researchPapers;
        },
        getResearchId(state) {
            return state.researchId;
        }
    },
    actions: {
        setOpenResearch(researchId: string, researchPapers: SavedPaper[]) {
            this.researchId = researchId;
            this.researchPapers = researchPapers;
        },
        setResearchPapers(researchPapers: SavedPaper[]) {
            this.researchPapers = researchPapers;
        }
    }
});