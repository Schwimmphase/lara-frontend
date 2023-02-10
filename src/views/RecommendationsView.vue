<script setup lang="ts">

import PaperCard from "@/components/cards/PaperCard.vue";
import type { Organizer } from "@/model/Organizer";

import type { Paper } from "@/model/Paper";
import type { Research } from "@/model/Research";

import { useOpenResearchStore } from "@/stores/openResearch";

import { reactive } from "@vue/reactivity";

import { useOpenPaperStore } from '@/stores/openPaper';
import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import type {SavedPaper} from "@/model/SavedPaper";
import {i18n} from "@/internationalization/i18n";
import PaperOrganizableList from "@/components/basic/PaperOrganizableList.vue";

const slotsRecommended = [
    {id: "recommendations", name: i18n.global.t("words.recommendations")}
];

const slotsReferences = [
    {id: "citations", name: i18n.global.t("words.citations")},
    {id: "references", name: i18n.global.t("words.references")},
];

let state: { showCitations: boolean, citations: Paper[], references: Paper[], recommendations: Paper[],
            research: Research | undefined, loadingRecommendations: boolean,
            loadingCitationsReferences: boolean} = reactive({
    citations: [],
    references: [],
    recommendations: [],
    research: undefined,
    showCitations: false,
    loadingRecommendations: true,
    loadingCitationsReferences: true
});

// Method to get the Recommendations from the API
async function setRecommendations(selectedOrganizers: Organizer[]): Promise<void> {
    if (state.research == undefined) {
        console.error("SET_RECOMMENDATIONS : Research is undefined")
        return;
    }
    
    state.loadingRecommendations = true;
    state.recommendations = await ResearchApiHandler.getRecommendations(state.research, selectedOrganizers);
    state.loadingRecommendations = false;
}

// Method to get the Recommendations from the API
async function setCitationReferences(selectedOrganizers: Organizer[]): Promise<void> {
    if (state.research == undefined) {
        console.error("SET_CITATIONS : Research is undefined")
        return;
    }
    
    state.loadingCitationsReferences = true;

    state.citations = await ResearchApiHandler.getCitations(state.research, selectedOrganizers);
    state.references = await ResearchApiHandler.getReferences(state.research, selectedOrganizers);

    state.loadingCitationsReferences = false;
}

function isSaved(paper: Paper): boolean {
    let researchPaper: SavedPaper[] = researchStore.getResearchPapers;
    return researchPaper.filter(savedPaper => savedPaper.paper.paperId == paper.paperId).length > 0;
}

document.title = i18n.global.t("pageTitles.recommendations") + " - lara";
useOpenPaperStore().resetStore();

// Get the persistent saved OpenResearch
let researchStore = useOpenResearchStore();
state.research = researchStore.openResearch;

setRecommendations([]);

setCitationReferences([]);

</script>


<template>
    <div class="mt-8 mx-16 h-100">
        <div class="d-flex">
            <span @click="state.showCitations = false"
                  :class="{ 'font-weight-bold': !state.showCitations, 'lara-clickable': state.showCitations }"
                  class="text-h4">
                {{ $t('recommendationsView.recommended') }}
            </span>
            <span
                @click="state.showCitations = true"
                :class="{ 'font-weight-bold': state.showCitations, 'lara-clickable': !state.showCitations }"
                class="text-h4 ml-3">
                {{ $t('recommendationsView.citationsReferences') }}
            </span><br>
        </div>
        
        <div class="mt-3">
            <div v-show="!state.showCitations">
                <paper-organizable-list :slots="slotsRecommended" :export-enabled="false"
                                        @organize="organizers => setRecommendations(organizers)">
                    <template v-slot:recommendations>
                        <div v-if="state.loadingRecommendations" class="h-50 w-100 ma-5 d-flex justify-center align-center">
                            <v-progress-circular indeterminate size="35"></v-progress-circular>
                        </div>

                        <paper-card v-for="(paper, index) in state.recommendations" :key="index" :paper="paper" v-else
                                    :research="state.research" :saved="isSaved(paper)" />
                        <span v-if="state.recommendations.length === 0 && !state.loadingRecommendations">
                            {{ $t('recommendationsView.empty') }}
                        </span>
                    </template>
                </paper-organizable-list>
            </div>
            <div v-show="state.showCitations">
                <paper-organizable-list :slots="slotsReferences" :export-enabled="false"
                                        @organize="organizers => setCitationReferences(organizers)">
                    <template v-slot:citations>
                        <div v-if="state.loadingCitationsReferences" class="h-50 w-100 ma-5 d-flex justify-center align-center">
                            <v-progress-circular indeterminate size="35"></v-progress-circular>
                        </div>

                        <paper-card v-for="(paper, index) in state.citations" :key="index" :paper="paper" v-else
                                    :research="state.research" :saved="isSaved(paper)" />
                        <span v-if="state.citations.length === 0 && !state.loadingCitationsReferences">
                            {{ $t('recommendationsView.empty') }}
                        </span>
                    </template>
                    <template v-slot:references>
                        <div v-if="state.loadingCitationsReferences" class="h-50 w-100 ma-5 d-flex justify-center align-center">
                            <v-progress-circular indeterminate size="35"></v-progress-circular>
                        </div>

                        <paper-card v-for="(paper, index) in state.references" :key="index" :paper="paper" v-else
                                    :research="state.research" :saved="isSaved(paper)" />
                        <span v-if="state.references.length === 0 && !state.loadingCitationsReferences">
                            {{ $t('recommendationsView.empty') }}
                        </span>
                    </template>
                </paper-organizable-list>
            </div>
        </div>
    </div>
</template>