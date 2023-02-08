<script setup lang="ts">

import OrganizableList from "@/components/basic/OrganizableList.vue";
import PaperCard from "@/components/cards/PaperCard.vue";
import YearOrganizer from "@/components/organizers/YearOrganizer.vue"
import YearSorter from "@/components/organizers/YearSorter.vue";
import { Organizer } from "@/model/Organizer";

import type { Paper } from "@/model/Paper";
import type { Research } from "@/model/Research";

import { useOpenResearchStore } from "@/stores/openResearch";

import { reactive } from "@vue/reactivity";

import { useOpenPaperStore } from '@/stores/openPaper';
import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import {SavedPaper} from "@/model/SavedPaper";
import {i18n} from "@/internationalization/i18n";

useOpenPaperStore().resetStore();

const slotsRecommended = [
    {id: "recommendations", name: i18n.global.t("words.recommendations")}
];

const slotsReferences = [
    {id: "citations", name: i18n.global.t("words.citations")},
    {id: "references", name: i18n.global.t("words.references")},
];

const organizerSlots = [
    {id: "filter-year", name: "Jahr filtern"},
    {id: "sort-year", name: "Jahr sortieren"},
];

let state: { showCitations: boolean, citations: Paper[] | undefined, references: Paper[] | undefined,
        recommendations: Paper[] | undefined, research: Research | undefined , loading: boolean} = reactive({
    showCitations: false,
    citations: undefined,
    references: undefined,
    recommendations: undefined,
    research: undefined,
    loading: true
});

let organizerState: { selectedOrganizers: Organizer[],
    yearValue: number[], sortByYear: boolean, descending: boolean | string } = reactive({
    selectedOrganizers: [],
    yearValue: [],
    sortByYear: false,
    descending: true,
});

// Method to call to build the Organizers
let onOrganize = () => {
    // List for the chosen organizers
    let organizers: Organizer[] = [];

    // Build the year organizer
    const yearOrganizer = new Organizer("year-filter", JSON.stringify(organizerState.yearValue));
    organizers.push(yearOrganizer);
    console.log(yearOrganizer);

    // TODO Check if only one sorter is selected

    if (organizerState.sortByYear) {
        console.log(organizerState.descending)
        let argument: string;
        if (organizerState.descending as boolean) {
            console.log("MACHE DESCENDING")
            argument = "descending";
        } else {
            console.log("MACHE ASCENDING")
            argument = "ascending";
        }
        const yearSorter = new Organizer("year-sorter", argument);
        organizers.push(yearSorter);
        console.log(yearSorter);
    }

}

// Get the persistent saved OpenResearch
let researchStore = useOpenResearchStore();

// Method to get the Recommendations from the API
async function setRecommendations(): Promise<void> {
    state.loading = true;

    state.research = researchStore.openResearch;

    // Get Paper Lists from API
    let research = state.research as Research;

    state.recommendations = await ResearchApiHandler.getRecommendations(research, []);
    state.references = await ResearchApiHandler.getReferences(research, []);
    state.citations = await ResearchApiHandler.getCitations(research, []);

    state.loading = false;
}

function isSaved(paper: Paper): boolean {
    let researchPaper: SavedPaper[] = researchStore.getResearchPapers;
    return researchPaper.filter(savedPaper => savedPaper.paper.paperId == paper.paperId).length > 0;
}


// Method to set the state for the year organizer
let yearChange = (from: number, to: number) => {
    organizerState.yearValue = [from, to];
}

let updateYearSorter = (sortByYear: boolean, descending: boolean | string) => {
    if (descending == "false") {
        descending = false;
    }

    if (descending == "true") {
        descending = true;
    }

    organizerState.sortByYear = sortByYear;
    organizerState.descending = descending;
}

setRecommendations();

// snackbars

let snackbarState = reactive({
    enqueued: false,
    hidden: false,
    timeout: 3000
})

</script>


<template>
    <div class="ma-4">
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

        <div v-if="state.loading" class="h-50 ma-5 d-flex justify-center align-center">
            <v-progress-circular indeterminate size="35"></v-progress-circular>
        </div>
        
        <div class="mt-3" v-if="!state.loading">
            <OrganizableList v-if="!state.showCitations"
                             :slots="slotsRecommended"
                             :organize-slots="organizerSlots"
                             :selected-organizers="state.selectedOrganizers"
                             @organize="onOrganize">
                <template v-slot:recommendations>
                    <paper-card v-for="(paper, index) in state.recommendations" :key="index" :paper="paper"
                                :research="state.research" :saved="isSaved(paper)" @enqueued="snackbarState.enqueued = true"/>
                </template>

                <template v-slot:filter-year>
                    <div class="w-100 mt-6 mx-5">
                        <!-- TODO: safe min max -->
                        <YearOrganizer @year-change="(from, to) => yearChange(from, to)" :min="1900" :max="(new Date()).getFullYear()"/>
                    </div>
                </template>

                <template v-slot:sort-year>
                    <div class="w-100 mt-6 mx-5">
                        <YearSorter @update="(sortByYear, descending) => updateYearSorter(sortByYear, descending)" />
                    </div>
                </template>
            </OrganizableList>
            <OrganizableList v-if="state.showCitations" :slots="slotsReferences" :organize-slots="organizerSlots" :selected-organizers="[]">
                <template v-slot:citations>
                    <paper-card v-for="(paper, index) in state.citations" :key="index" :paper="paper"
                                :research="state.research" :saved="isSaved(paper)" @enqueued="snackbarState.enqueued = true" />
                </template>
                <template v-slot:references>
                    <paper-card v-for="(paper, index) in state.references" :key="index" :paper="paper"
                                :research="state.research" :saved="isSaved(paper)" @enqueued="snackbarState.enqueued = true" />
                </template>
            </OrganizableList>
        </div>
    </div>

    <v-snackbar v-model="snackbarState.enqueued" :timeout="snackbarState.timeout">
        {{ $t('recommendationsView.snackbar.enqueued') }}
        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="snackbarState.enqueued = false">
                {{ $t('words.close') }}
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarState.hidden" :timeout="snackbarState.timeout">
        {{ $t('recommendationsView.snackbar.hidden') }}
        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="snackbarState.hiddne = false">
                {{ $t('words.close') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>


<style scoped>

@import '../assets/main.css';

</style>
