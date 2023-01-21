<script setup lang="ts">

import { reactive } from 'vue';
import router from '../router'

import ReturnButtonComponent from './ReturnButtonComponent.vue';
import RecommendationsButtonComponent from './RecommendationsButtonComponent.vue';

import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown.vue';
import PlusIcon from 'vue-material-design-icons/Plus.vue';
import FormatListIcon from 'vue-material-design-icons/FormatListBulleted.vue';
import EyeOffIcon from 'vue-material-design-icons/EyeOff.vue';

import type { SavedPaper } from '../model/SavedPaper';
import type { Research } from '../model/Research';
import { SaveState } from '../model/SaveState';

import { useResearchStore } from '../stores/research'

// TODO nur testzwecke
import '../model/_testResearch';
import { testResearch, testSavedPaperList } from '../model/_testResearch';


let matchesSaveState = (paper: SavedPaper, state: SaveState): boolean => {
    return paper.saveState == state;
}

let openSavedPaper = (savedPaper: SavedPaper): void => {
    // Build id from research and paper id
    let id: string = savedPaper.research.id + "-" + savedPaper.paper.id;

    // Navigate to paperDetail-route
    router.push({ name: 'paperDetails', query: { id: id }});
}

let changeSaveState = (savedPaper: SavedPaper, saveState: SaveState) => {
    console.log("Change state of paper! " + savedPaper.paper.title);
    // TODO Call API to change save state of paper

    // TODO Force a new fetch of the researchPapers
}

let navigateToResearchOverview = (research: Research) => {
    let id: string = research.id;

    router.push({ name: 'researchOverview', query: { id: id }});
}


// Pinia store for the research
const store = useResearchStore();

// TODO Nur zu Testzwecken drin... sobald die Research Papers gesetzt werden, kann das wieder weg 
store.setOpenResearch(testResearch, testSavedPaperList);

// Get the research from the store
let research: Research = store.getResearch;
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
        <v-navigation-drawer>
            <div class="mx-2 my-3">
                <div class="w-75">
                    
                    <RecommendationsButtonComponent />
                    <ReturnButtonComponent class="mt-2" />
                </div>
                
                <div class="mt-2">
                    <span class="text-h6 font-weight-bold">{{ research.title }}</span>
                    <span @click="navigateToResearchOverview(research)" class="ml-2 lara-sidebar-link text-h6"><FormatListIcon /></span>
                </div>

                <!-- Section for the enqueued papers -->
                <div @click="toggleEnqueued" class="lara-collapse-div">
                    <span v-show="state.enqueuedShown" class="px-2"><ChevronDownIcon /></span>
                    <span v-show="!state.enqueuedShown" class="px-2"><ChevronRightIcon /></span>
                    <span class="text-h5">gemerkt</span>
                    
                    
                </div>

                <!-- List of the enqueued papers -->
                <v-list v-show="state.enqueuedShown">
                    <v-list-item v-bind:key="index" v-for="(savedPaper, index) in researchPapers.filter((savedPaper) => {return savedPaper.saveState == SaveState.enqueued})">
                        <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link">{{ savedPaper.paper.title }}</span>
                        <span @click="changeSaveState(savedPaper, SaveState.added)" class="ml-2 lara-sidebar-link"><PlusIcon /></span>
                    </v-list-item>
                    <v-list-item>
                        <v-divider></v-divider>
                    </v-list-item>
                </v-list>

                <!-- Section for the added papers -->
                <div @click="toggleAdded" class="mt-2 lara-collapse-div">
                    <span v-show="state.addedShown" class="px-2"><ChevronDownIcon /></span>
                    <span v-show="!state.addedShown" class="px-2"><ChevronRightIcon /></span>
                    <span class="text-h5">hinzugefügt</span>
                </div>

                <v-list v-show="state.addedShown">
                    <!-- List of the added papers -->
                    <v-list-item v-bind:key="index" v-for="(savedPaper, index) in researchPapers.filter((savedPaper) => {return savedPaper.saveState == SaveState.added})">
                        <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link">{{ savedPaper.paper.title }}</span>
                    </v-list-item>
                    <v-list-item>
                        <v-divider></v-divider>
                    </v-list-item>
                </v-list>

                <!-- Section for the hidden papers -->
                <div @click="toggleHidden" class="mt-2 lara-collapse-div">
                    <span v-show="state.hiddenShown" class="px-2 lara-hidden-link"><ChevronDownIcon /></span>
                    <span v-show="!state.hiddenShown" class="px-2 lara-hidden-link"><ChevronRightIcon /></span>
                    <span class="text-h5 lara-hidden-link">ausgeblendet</span><span class="text-h6 lara-hidden-link"><EyeOffIcon class="ml-2" /></span>
                </div>

                <v-list v-show="state.hiddenShown">
                    <v-list-item v-bind:key="index" v-for="(savedPaper, index) in researchPapers.filter((savedPaper) => {return savedPaper.saveState == SaveState.hidden})">
                        <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link">{{ savedPaper.paper.title }}</span>
                        <span @click="changeSaveState(savedPaper, SaveState.added)" class="ml-2 lara-sidebar-link"><PlusIcon /></span>
                    </v-list-item>
                    <v-list-item>
                        <v-divider></v-divider>
                    </v-list-item>
                </v-list>
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

.lara-hidden-link {
    color: rgb(175, 175, 175);
}
</style>