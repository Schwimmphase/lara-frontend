<script setup lang="ts">

import OrganizableList from "@/components/basic/OrganizableList.vue";
import UnsavedPaperCard from "@/components/cards/UnsavedPaperCard.vue";
import YearOrganizer from "@/components/organizers/YearOrganizer.vue"
import YearSorter from "@/components/organizers/YearSorter.vue";

// TODO  Nur wegen Test
import { testPaperList } from "@/model/_testResearch";
import { Organizer } from "@/model/Organizer";

import type { Paper } from "@/model/Paper";
import type { Research } from "@/model/Research";

import { useOpenResearchStore } from "@/stores/openResearch";

import { reactive } from "@vue/reactivity";

import { useOpenPaperStore } from '@/stores/openPaper';

useOpenPaperStore().resetStore();

const slotsRecommended = [
    {id: "recommendations", name: "Empfehlungen"}
];

const slotsReferences = [
    {id: "citations", name: "Zitate"},
    {id: "references", name: "Referenzen"},
];

const organizerSlots = [
    {id: "filter-year", name: "Jahr filtern"},
    {id: "sort-year", name: "Jahr sortieren"},
];

let state: { showCitations: boolean, citations: Paper[] | undefined, references: Paper[] | undefined, recommendations: Paper[] | undefined, research: Research | undefined } = reactive({
    showCitations: false,
    citations: undefined,
    references: undefined,
    recommendations: undefined,
    research: undefined,
});

let organizerState: { yearValue: number[], sortByYear: boolean, descending: boolean | string } = reactive({
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
let setRecommendations = () => {
    state.research = researchStore.openResearch;

    // TODO Nur wegen Test dies das
    state.recommendations = testPaperList;
    state.references = testPaperList;
    state.citations = testPaperList;

    // Get Paper Lists from API
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

</script>


<template>
    <div class="ma-4">
        <div class="d-flex">
            <span
                @click="state.showCitations = false"
                :class="{ 'font-weight-bold': !state.showCitations, 'lara-clickable': state.showCitations }"
                class="text-h4"
            >Empfohlen</span>
            <span
                @click="state.showCitations = true"
                :class="{ 'font-weight-bold': state.showCitations, 'lara-clickable': !state.showCitations }"
                class="text-h4 ml-3"
                >Zitate/Referenzen</span><br>
        </div>
        
        <div class="mt-3">
            <OrganizableList v-if="!state.showCitations" :slots="slotsRecommended" :organize-slots="organizerSlots" :selected-organizers="[]" @organize="onOrganize">
                <template v-slot:recommendations>
                    <UnsavedPaperCard v-for="(paper, index) in state.recommendations" :key="index" :paper="paper" :research="(state.research ? state.research : undefined)" />
                </template>

                <template v-slot:filter-year>
                    <div class="w-100 mt-6 mx-5">
                        <YearOrganizer @year-change="(from, to) => yearChange(from, to)" />
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
                    <UnsavedPaperCard v-for="(paper, index) in state.citations" :key="index" :paper="paper" :research="(state.research ? state.research : undefined)" />
                </template>
                <template v-slot:references>
                    <UnsavedPaperCard v-for="(paper, index) in state.references" :key="index" :paper="paper" :research="(state.research ? state.research : undefined)" />
                </template>
            </OrganizableList>
        </div>
    </div>
</template>

<style scoped>

@import '../assets/main.css';


</style>