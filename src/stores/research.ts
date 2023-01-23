import { defineStore } from "pinia";

import type { SavedPaper } from "../model/SavedPaper";
import type { Research } from "../model/Research";

export const useResearchStore = defineStore('research', {
    state: (): { research: Research | null, researchPapers: SavedPaper[] } => ({
        research: null,
        researchPapers: []
    }),
    getters: {
        getResearchPapers(state) {
            return state.researchPapers;
        },
        getResearch(state) {
            return state.research;
        }
    },
    actions: {
        setOpenResearch(research: Research, researchPapers: SavedPaper[]) {
            this.research = research;
            this.researchPapers =researchPapers;
        },
        setResearchPapers(researchPapers: SavedPaper[]) {
            this.researchPapers = researchPapers;
        }
    }
});