<template>

    <div class="mt-8 mx-16 h-100">
        <div class="d-flex">
            <span id="recommendations" @click="state.visibleTab = 1"
                  :class="{ 'font-weight-bold': state.visibleTab === 1, 'lara-clickable': state.visibleTab !== 1 }"
                  class="text-h4">
                {{ $t('words.recommendations') }}
            </span>
            <span id="citations" @click="state.visibleTab = 2"
                  :class="{ 'font-weight-bold': state.visibleTab === 2, 'lara-clickable': state.visibleTab !== 2 }"
                  class="text-h4 ml-3">
                {{ $t('words.citations') }}
            </span>
            <span id="references" @click="state.visibleTab = 3"
                  :class="{ 'font-weight-bold': state.visibleTab === 3, 'lara-clickable': state.visibleTab !== 3 }"
                  class="text-h4 ml-3">
                {{ $t('words.references') }}
            </span>
        </div>

        <div class="mt-3">
            <div v-show="state.visibleTab === 1">
                <paper-organizable-list :slots="slotsRecommendations" :export-enabled="false"
                                        @organize="organizers => setRecommendations(organizers)">
                    <template v-slot:recommendations>
                        <div v-if="state.loadingRecommendations" class="h-50 w-100 ma-5 d-flex justify-center align-center">
                            <v-progress-circular indeterminate size="35" id="loading-recommendations"></v-progress-circular>
                        </div>

                        <paper-card v-for="(paper, index) in state.recommendations" :key="index" :paper="paper" v-else
                                    :research="state.research" :saved="isSaved(paper)"/>
                        <span v-if="state.recommendations.length === 0 && !state.loadingRecommendations">
                            {{ $t('recommendationsView.empty') }}
                        </span>
                    </template>
                </paper-organizable-list>
            </div>
            <div v-show="state.visibleTab === 2">
                <paper-organizable-list :slots="slotsCitations" :export-enabled="false"
                                        @organize="organizers => setCitations(organizers)">
                    <template v-slot:citations>
                        <div v-if="state.loadingCitations" class="h-50 w-100 ma-5 d-flex justify-center align-center">
                            <v-progress-circular indeterminate size="35" id="loading-citations"></v-progress-circular>
                        </div>

                        <paper-card v-for="(paper, index) in state.citations" :key="index" :paper="paper" v-else
                                    :research="state.research" :saved="isSaved(paper)"/>
                        <span v-if="state.citations.length === 0 && !state.loadingCitations">
                            {{ $t('recommendationsView.empty') }}
                        </span>
                    </template>
                </paper-organizable-list>
            </div>
            <div v-show="state.visibleTab === 3">
                <paper-organizable-list :slots="slotsReferences" :export-enabled="false"
                                        @organize="organizers => setReferences(organizers)">
                    <template v-slot:references>
                        <div v-if="state.loadingReferences" class="h-50 w-100 ma-5 d-flex justify-center align-center">
                            <v-progress-circular indeterminate size="35" id="loading-references"></v-progress-circular>
                        </div>

                        <paper-card v-for="(paper, index) in state.references" :key="index" :paper="paper" v-else
                                    :research="state.research" :saved="isSaved(paper)"/>
                        <span v-if="state.references.length === 0 && !state.loadingReferences">
                            {{ $t('recommendationsView.empty') }}
                        </span>
                    </template>
                </paper-organizable-list>
            </div>
        </div>
    </div>

</template>


<script setup lang="ts">

import {reactive} from "vue";
import type {Organizer} from "@/model/Organizer";
import {Paper} from "@/model/Paper";
import PaperOrganizableList from "@/components/basic/PaperOrganizableList.vue";
import PaperCard from "@/components/cards/PaperCard.vue";
import type {Research} from "@/model/Research";
import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import type {SavedPaper} from "@/model/SavedPaper";
import {useOpenResearchStore} from "@/stores/openResearch";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";

let state: { visibleTab: number, loadingRecommendations: boolean, loadingCitations: boolean,
            loadingReferences: boolean, research: Research | undefined, recommendations: Paper[], citations: Paper[],
            references: Paper[] } = reactive({
    visibleTab: 1,
    loadingRecommendations: true,
    loadingCitations: true,
    loadingReferences: true,
    research: undefined,
    recommendations: [],
    citations: [],
    references: []
});

const props = defineProps({
    sourcePaper: {type: Paper, required: false}
});

const slotsRecommendations = [
    { id: "recommendations", name: "recommendations", key: "recommendations" }
];

const slotsCitations = [
    { id: "citations", name: "citations", key: "citations" }
];

const slotsReferences = [
    { id: "references", name: "references", key: "references" }
];

// Get the persistent saved OpenResearch
let researchStore = useOpenResearchStore();
state.research = researchStore.openResearch;

function isSaved(paper: Paper): boolean {
    let researchPaper: SavedPaper[] = researchStore.getResearchPapers;
    return researchPaper.filter(savedPaper => savedPaper.paper.paperId == paper.paperId).length > 0;
}

// Method to get the Recommendations from the API
async function setRecommendations(selectedOrganizers: Organizer[]): Promise<void> {
    if (state.research == undefined) {
        console.error("SET_RECOMMENDATIONS : Research is undefined")
        return;
    }

    state.loadingRecommendations = true;
    if (props.sourcePaper) {
        state.recommendations = await PaperApiHandler.getRecommendations(props.sourcePaper, selectedOrganizers);
    }  else {
        state.recommendations = await ResearchApiHandler.getRecommendations(state.research, selectedOrganizers);
    }
    state.loadingRecommendations = false;
}

// Method to get the Citations from the API
async function setCitations(selectedOrganizers: Organizer[]): Promise<void> {
    if (state.research == undefined) {
        console.error("SET_CITATIONS : Research is undefined")
        return;
    }

    state.loadingCitations = true;
    if (props.sourcePaper) {
        state.citations = await PaperApiHandler.getCitations(props.sourcePaper, selectedOrganizers);
    } else {
        state.citations = await ResearchApiHandler.getCitations(state.research, selectedOrganizers);
    }
    state.loadingCitations = false;
}

// Method to get the References from the API
async function setReferences(selectedOrganizers: Organizer[]): Promise<void> {
    if (state.research == undefined) {
        console.error("SET_REFERENCES : Research is undefined")
        return;
    }

    state.loadingReferences = true;
    if (props.sourcePaper) {
        state.references = await PaperApiHandler.getReferences(props.sourcePaper, selectedOrganizers);
    } else {
        state.references = await ResearchApiHandler.getReferences(state.research, selectedOrganizers);
    }
    state.loadingReferences = false;
}

setRecommendations([]);
setCitations([]);
setReferences([]);

</script>
