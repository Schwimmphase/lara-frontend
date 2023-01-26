import { defineStore } from "pinia";

import type { Research } from "@/model/Research";

export const useResearchesStore = defineStore('researches', {
    state: () => {
        return {
            researches: new Array<Research>(),
        }
    },
    getters: {
        getResearches(state) {
            return state.researches;
        }
    },
    actions: {
        addResearch(research: Research) {
            this.researches.push(research);
        },
        reset() {
            while(this.researches?.length != 0) {
                this.researches.pop();
            }
        }
    }
});
