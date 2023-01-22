<script setup lang="ts">

import { reactive } from 'vue';
import router from '../router';

import ReturnButtonComponent from './ReturnButtonComponent.vue';
import RecommendationsButtonComponent from './RecommendationsButtonComponent.vue';
import SearchbarComponent from './SearchbarComponent.vue';

import type { SavedPaper } from '@/model/SavedPaper';
import type { Research } from '@/model/Research';
import { SaveState } from '@/model/SaveState';

import { useResearchStore } from '@/stores/research';

import { testResearch } from '@/model/_testResearch';
import { testSavedPaperList } from '@/model/_testResearch';
import ExpandableList from "@/components/ExpandableList.vue";
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';


let matchesSaveState = (paper: SavedPaper, state: SaveState): boolean => {
    return paper.saveState == state;
}

let openSavedPaper = (savedPaper: SavedPaper): void => {
    // Build id from research and paper id
    let id: string = savedPaper.research.id + "-" + savedPaper.paper.id;

    // Navigate to paperDetail-route
    router.push({name: 'paperDetails', query: {id: id}});
}

let changeSaveState = (savedPaper: SavedPaper, saveState: SaveState) => {
    console.log("Change state of paper! " + savedPaper.paper.title);
    // TODO Call API to change save state of paper
    PaperApiHandler.changeSaveState(savedPaper, saveState);
    // TODO Force a new fetch of the researchPapers
}

let navigateToResearchOverview = (research: Research) => {
    let id: string = research.id;

    router.push({name: 'researchOverview', query: {id: id}});
}


// Pinia store for the research
const store = useResearchStore();

// TODO Nur zu Testzwecken drin... sobald die Research Papers gesetzt werden, kann das wieder weg 
store.setOpenResearch(testResearch, testSavedPaperList);

// Get the research from the store
let research: Research | null = store.getResearch;
let researchPapers: SavedPaper[] = store.getResearchPapers;

let addedPapers: SavedPaper[] = researchPapers.filter((savedPaper) => matchesSaveState(savedPaper, SaveState.added));
let enqueued: SavedPaper[] = researchPapers.filter((savedPaper) => matchesSaveState(savedPaper, SaveState.enqueued));
let hidden: SavedPaper[] = researchPapers.filter((savedPaper) => matchesSaveState(savedPaper, SaveState.hidden));
</script>

<template>
    <!-- Navigations-drawer for the sidebar to manage the paper of a research -->
    <v-navigation-drawer>
        <div class="mx-2 my-3">
            <div class="w-75">
                <SearchbarComponent />
                <RecommendationsButtonComponent class="mt-2"/>
                <ReturnButtonComponent class="mt-2"/>
            </div>

            <div class="mt-4">
                <span class="text-h6 font-weight-bold">{{ research != null ? research.title : null }}</span>
                <span @click="research != null ? navigateToResearchOverview(research)" class="ml-2 lara-sidebar-link text-h6"><v-icon
                    icon="mdi-view-grid"/></span>
            </div>

            <!-- Section for the enqueued papers -->
            <expandable-list title="gemerkt" :expanded="true">
                <v-list-item v-bind:key=index
                             v-for="(savedPaper, index) in researchPapers.filter((savedPaper) => {return savedPaper.saveState === SaveState.enqueued})">
                    <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link">{{ savedPaper.paper.title }}</span>
                    <span @click="changeSaveState(savedPaper, SaveState.added)" class="ml-2 lara-sidebar-link"><v-icon
                        icon="mdi-plus"/></span>
                </v-list-item>
            </expandable-list>

            <!-- Section for the added papers -->
            <expandable-list title="hinzugefügt" :expanded="true">
                <!-- List of the added papers -->
                <v-list-item v-bind:key="index"
                             v-for="(savedPaper, index) in researchPapers.filter((savedPaper) => {return savedPaper.saveState === SaveState.added})">
                    <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link">{{ savedPaper.paper.title }}</span>
                </v-list-item>
            </expandable-list>


            <!-- Section for the hidden papers -->
            <expandable-list title="ausgeblendet" icon="mdi-eye-off" :hidden="true">
                <v-list-item v-bind:key="index"
                             v-for="(savedPaper, index) in researchPapers.filter((savedPaper) => {return savedPaper.saveState === SaveState.hidden})">
                    <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link">{{ savedPaper.paper.title }}</span>
                    <span @click="changeSaveState(savedPaper, SaveState.added)" class="ml-2 lara-sidebar-link"><v-icon
                        icon="mdi-plus"/></span>
                </v-list-item>
            </expandable-list>
        </div>
    </v-navigation-drawer>

    <!--
    <v-navigation-drawer>

        <v-list>
            <v-list-item>

            </v-list-item>


            <v-list-item v-bind:key="index" v-for="(savedPaper, index) in researchPapers">
                {{ savedPaper.paper.title }}
            </v-list-item>

        </v-list>
    </v-navigation-drawer>
    -->
</template>

<style scoped>

@import '../assets/main.css';

.lara-collapse-div span::selection {
    background: none;
}

.lara-sidebar-link {
    color: rgb(71, 71, 71);
    transition: color ease-in-out 0.3s, text-decoration-color ease-in-out 0.3s;
}

.lara-sidebar-link:hover {
    cursor: pointer;
    color: #000;
}
</style>