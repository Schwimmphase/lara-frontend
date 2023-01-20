import { defineStore } from "pinia";
import { ref } from "vue";


import { SavedPaper } from "../model/SavedPaper";

export const useResearchPaperStore = defineStore('researchPapers', {
    state: () => ({ researchPapers: [] })
});