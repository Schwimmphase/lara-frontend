<script setup lang="ts">

import { reactive } from 'vue';
import router from '../router'

import type { SavedPaper } from '../model/SavedPaper';

import { useResearchStore } from '../stores/research'

import '../model/_testResearch';
import { testSavedPaper1, testSavedPaperList } from '../model/_testResearch';
import { testSavedPaper2 } from '../model/_testResearch';
import { testSavedPaper3 } from '../model/_testResearch';
import { SaveState } from '../model/SaveState';

let matchesSaveState = (paper: SavedPaper, state: SaveState): boolean => {
    return paper.saveState == state;
}


let openSavedPaper = (savedPaper: SavedPaper): void => {
    // Build id from research and paper id
    let id: string = savedPaper.research.id + "-" + savedPaper.paper.id;

    // Navigate to paperDetail-route
    router.push({ name: 'paperDetails', query: { id: id }});
}

let changeSaveState = (savedPaper: SavedPaper) => {
    console.log("Change state of paper! " + savedPaper.paper.title);
    // TODO Call API to change save state of paper

    // TODO Force a new fetch of the researchPapers
}



// Pinia store for the research
const store = useResearchStore();

// TODO Nur zu Testzwecken drin... sobald die Research Papers gesetzt werden, kann das wieder weg 
store.setOpenResearch("id12345", testSavedPaperList);

// Get the research papers from the store
let researchPapers: SavedPaper[] = store.getResearchPapers;

let addedPapers: SavedPaper[] = researchPapers.filter((savedPaper) => matchesSaveState(savedPaper, SaveState.added));
let enqueued: SavedPaper[] = researchPapers.filter((savedPaper) => matchesSaveState(savedPaper, SaveState.enqueued));
let hidden: SavedPaper[] = researchPapers.filter((savedPaper) => matchesSaveState(savedPaper, SaveState.hidden));

// Variables to keep track, which lists of papers are shown
let state: ({addedShown: boolean, enqueuedShown: boolean, hiddenShown: boolean}) = reactive({
    addedShown: true,
    enqueuedShown: true,
    hiddenShown: false,
});

let toggleAdded = (): void => {
    state.addedShown = !state.addedShown;
}

let toggleEnqueued = (): void => {
    state.enqueuedShown = !state.enqueuedShown;
}

let toggleHidden = (): void => {
    state.hiddenShown = !state.hiddenShown;
}

</script>

<template>
    <div>
        <!-- Navigations-drawer for the sidebar to manage the paper of a research -->
        <v-navigation-drawer class="mx-2">
            <!-- Section for the enqueued papers -->
            <div @click="toggleEnqueued" class="mt-5 lara-collapse-div">
                <span class="lara-h2">gemerkt</span>
                <span v-show="state.enqueuedShown" class="pl-2">aus</span>
                <span v-show="!state.enqueuedShown" class="px-2">ein</span>
            </div>

            <!-- List of the added papers -->
            <v-list v-show="state.enqueuedShown">
                <v-list-item v-bind:key="index" v-for="(savedPaper, index) in researchPapers.filter((savedPaper) => {return savedPaper.saveState == SaveState.enqueued})">
                    <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link">{{ savedPaper.paper.title }}</span>
                    <span @click="changeSaveState(savedPaper, SaveState.added)" class="ml-2 lara-sidebar-link">füge hinzu</span>
                </v-list-item>
                <v-list-item>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>
            

            <!-- Section for the added papers -->
            <div @click="toggleAdded" class="mt-5 lara-collapse-div">
                <span class="lara-h2">hinzugefügt</span>
                <span v-show="state.addedShown" class="pl-2">aus</span>
                <span v-show="!state.addedShown" class="px-2">ein</span>
            </div>

            <v-list v-show="state.addedShown">
                <!-- List of the added papers -->
                <v-list-item v-bind:key="index" v-for="(savedPaper, index) in researchPapers.filter((savedPaper) => {return savedPaper.saveState == SaveState.enqueued})">
                    <span>HALLO</span>
                </v-list-item>
            </v-list>

            <!-- Section for the hidden papers -->
            <div @click="toggleHidden" class="mt-5 lara-collapse-div">
                <span class="lara-h2">ausgeblendet</span>
                <span v-show="state.hiddenShown" class="pl-2">aus</span>
                <span v-show="!state.hiddenShown" class="px-2">ein</span>
            </div>

            <v-list v-show="state.hiddenShown">
                <v-list-item v-bind:key="index" v-for="(savedPaper, index) in researchPapers.filter((savedPaper) => {return savedPaper.saveState == SaveState.enqueued})">
                    <span>HALLO</span>
                </v-list-item>
            </v-list>
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
    </div>
</template>

<style scoped>

@import '../assets/main.css';

.lara-collapse-div {
    color: #000;
}

.lara-collapse-div span::selection {
    background: none;
}

.lara-collapse-div:hover {
    cursor: pointer;
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