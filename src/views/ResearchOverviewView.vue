<template>
    <v-container class="pt-8 px-16">
        <h1 class="text-h3 font-weight-bold">{{ research != null ? research.title : "" }}</h1>
        <organizable-list :slots="slots" :organize-slots="organizeSlots" :right-button="$t('researchOverview.export')"
                          :selected-organizers="selectedOrganizers">
            <template v-slot:added>
                <research-overview-card v-for="(savedPaper, index) in testSavedPaperList"
                                        :key="index"
                                        :paper="savedPaper"
                                        @open-card="(paper) => openPaper(paper)"
                                        >
                </research-overview-card>
            </template>
            <template v-slot:enqueued>
                <research-overview-card v-for="(savedPaper, index) in testSavedPaperList"
                                        :key="index"
                                        :paper="savedPaper"
                                        :add-button="true"
                                        @open-card="(paper) => openPaper(paper)"
                                        >
                </research-overview-card>
            </template>
            <template v-slot:hidden>
                <research-overview-card v-for="(savedPaper, index) in testSavedPaperList"
                                        :key="index"
                                        :paper="savedPaper"
                                        @open-card="(paper) => openPaper(paper)"
                                        >
                </research-overview-card>
            </template>
        </organizable-list>
    </v-container>
</template>


<script setup lang="ts">

import OrganizableList from "@/components/basic/OrganizableList.vue";
import type {Organizer} from "@/components/basic/OrganizableList.vue";
import {testSavedPaperList} from "@/model/_testResearch";
import type { SavedPaper } from "@/model/SavedPaper";
import { useOpenResearchStore } from "@/stores/openResearch.js";
import ResearchOverviewCard from "@/components/cards/ResearchOverviewCard.vue";
import type { Slot } from "@/components/basic/OrganizableList.vue";
import router from "../router";
import { useOpenPaperStore } from "@/stores/openPaper";
import { OpenPaper } from "@/stores/model/OpenPaper";

// reset open paper
useOpenPaperStore().resetStore();

// Pinia store for the research
const store = useOpenResearchStore();

// TODO Nur zu Testzwecken drin... sobald die Research Papers gesetzt werden, kann das wieder weg
store.setResearchPapers(testSavedPaperList);

// Get the research from the store
let research = store.getResearch;

const organizeSlots: Slot[] = [];

const selectedOrganizers: Organizer[] = [];

let slots: Slot[] = [
    { id: "added" },
    { id: "enqueued", name: "Enqueued" }, // TODO: how do you insert translation keys in ts?
    { id: "hidden", name: "Hidden" } // TODO: how do you insert translation keys in ts?
];

let openPaper = (savedPaper: SavedPaper) => {
    useOpenPaperStore().setPaper(new OpenPaper(undefined, savedPaper, true));
    router.push({ name: 'paperDetails', query: { research: savedPaper.research.id, paper: savedPaper.paper.paperId } });
}

</script>
