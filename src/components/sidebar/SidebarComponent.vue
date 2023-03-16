<script setup lang="ts">

import router from '../../router';

import ReturnButtonComponent from './ReturnButtonComponent.vue';
import RecommendationsButtonComponent from './RecommendationsButtonComponent.vue';
import SearchbarComponent from './SearchbarComponent.vue';

import type {SavedPaper} from '@/model/SavedPaper';
import type {Research} from '@/model/Research';
import {SaveState} from '@/model/SaveState';

import {useOpenResearchStore} from '@/stores/openResearch';

import ExpandableList from "@/components/basic/ExpandableList.vue";
import {PaperApiHandler} from '@/api/Paper/PaperApiHandler';
import {reactive} from '@vue/reactivity';
import {ResearchApiHandler} from '@/api/Research/ResearchApiHandler';

let props = defineProps({
    showSearch: Boolean,
    showRecommendations: Boolean
});

// Pinia store for the research
const store = useOpenResearchStore();

let state: { research: Research | undefined, researchPapers: SavedPaper[], addedPapers: SavedPaper[], enqueuedPapers: SavedPaper[], hiddenPapers: SavedPaper[], show: boolean, notShow: boolean } = reactive({
    loading: true,
    research: store.getResearch,
    researchPapers: [],
    addedPapers: [],
    enqueuedPapers: [],
    hiddenPapers: [],
    show: true,
    notShow: false
});

useOpenResearchStore().$subscribe((mutation, state) => {
    getPapers();
});

// Method to get the research papers
let getPapers = async () => {
    if (state.research == undefined) {
        console.error("GET_PAPERS : Research in store is not defined");
        return;
    }

    let response = await ResearchApiHandler.getSavedPapers(state.research, [])

    state.researchPapers = response;

    state.addedPapers = state.researchPapers.filter((paper) => matchesSaveState(paper, SaveState.added));
    state.enqueuedPapers = state.researchPapers.filter((paper) => matchesSaveState(paper, SaveState.enqueued));
    state.hiddenPapers = state.researchPapers.filter((paper) => matchesSaveState(paper, SaveState.hidden));
}

// Method to navigate to the research overview
let navigateToResearchOverview = (research: Research) => {
    let id: string = research.id;

    router.push({name: 'researchOverview', query: {id: id}});
}

// Method to open a saved paper
let openSavedPaper = (savedPaper: SavedPaper): void => {
    // Navigate to paperDetail-route
    router.push({name: 'paperDetails', query: {research: savedPaper.research.id, paper: savedPaper.paper.paperId}});
}

// Helper methods
// Method to change the saved State of a paper
let changeSaveState = async (savedPaper: SavedPaper, saveState: SaveState) => {
    await PaperApiHandler.changeSaveState(savedPaper, saveState);
    
    await getPapers();
}

// Method to filter saved papers based on their SaveState
let matchesSaveState = (paper: SavedPaper, state: SaveState): boolean => {
    return paper.saveState == state;
}

// Methods for the mini sidebar
let navigateToSearch = () => {
    router.push({ name: 'search' });
}

let navigateToRecommendations = () => {
    router.push({ name: 'recommendations' });
}

let returnPage = () => {
    router.back();
}

let toggleSidebar = (show: boolean) => {
    state.show = show;
    state.notShow = !show;
}

// Get the papers of the api
getPapers();

</script>


<template>
    <!-- Navigations-drawer for the sidebar to manage the paper of a research -->
    <v-navigation-drawer width="300" permanent v-model="state.show">
        <v-icon class="lara-fixed-icon lara-fixed-icon-right" @click="toggleSidebar(false)" size="32"
                :title="$t('sidebar.collapse')">mdi-chevron-left</v-icon>
        <div class="mx-2 mr-7 my-3">
            <div>
                <SearchbarComponent v-if="props.showSearch"/>
                <RecommendationsButtonComponent v-if="props.showRecommendations" class="mt-2"/>
                <ReturnButtonComponent class="mt-2"/>
            </div>

            <div class="mt-4">
                <span class="text-h6 font-weight-bold">{{ state.research != null ? state.research.title : null }}</span>
                <span @click="state.research != null ? navigateToResearchOverview(state.research) : null"
                      class="ml-2 lara-sidebar-link text-h6">
                    <v-icon :title="$t('words.recommendations')" icon="mdi-view-grid"/>
                </span>
            </div>

            <!-- Section for the enqueued papers -->
            <expandable-list :title="$t('sidebar.enqueued')" :expanded="true">
                <v-list-item v-for="(savedPaper, index) in state.enqueuedPapers" :key="index">
                    <span style="white-space: pre;">
                        <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link" style="white-space: normal">{{ savedPaper.paper.title }}</span>
                        <span @click="changeSaveState(savedPaper, SaveState.added)" class="ml-2 lara-sidebar-link">
                            <v-icon :title="$t('detailSidebar.add')">mdi-plus</v-icon>
                        </span>
                    </span>
                </v-list-item>
            </expandable-list>

            <!-- Section for the added papers -->
            <expandable-list :title="$t('sidebar.added')" :expanded="true">
                <!-- List of the added papers -->
                <v-list-item v-for="(savedPaper, index) in state.addedPapers" :key="index">
                    <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link">{{ savedPaper.paper.title }}</span>
                </v-list-item>
            </expandable-list>


            <!-- Section for the hidden papers -->
            <expandable-list :title="$t('sidebar.hidden')" icon="mdi-eye-off" :hidden="true">
                <v-list-item v-for="(savedPaper, index) in state.hiddenPapers" v-bind:key="index">
                    <span style="white-space: pre;">
                        <span @click="openSavedPaper(savedPaper)" class="lara-sidebar-link" style="white-space: normal">{{ savedPaper.paper.title }}</span>
                        <span @click="changeSaveState(savedPaper, SaveState.added)" class="ml-2 lara-sidebar-link">
                            <v-icon :title="$t('detailSidebar.add')">mdi-plus</v-icon>
                        </span>
                    </span>
                </v-list-item>
            </expandable-list>
        </div>
    </v-navigation-drawer>

    <v-navigation-drawer width="56" permanent v-model="state.notShow">
        <div class="d-flex flex-column align-center">
            <v-icon class="lara-fixed-icon" @click="toggleSidebar(true)" size="32"
                    :title="$t('sidebar.expand')">mdi-chevron-right</v-icon>
        </div>
        
        <div class="d-flex flex-column mx-2 my-3 justify-center align-center">
            <v-icon class="mt-4" v-if="props.showSearch" @click="navigateToSearch" size="32"
                    :title="$t('researchOverview.globalSearch')">mdi-magnify</v-icon>
            <v-icon class="mt-4" v-if="props.showRecommendations" @click="navigateToRecommendations" size="32"
                    :title="$t('words.recommendations')">mdi-book</v-icon>
            <v-icon class="mt-4" @click="returnPage" size="30"
                    :title="$t('sidebar.returnButton')">mdi-arrow-left</v-icon>
            <v-icon class="mt-4" @click="state.research != null ? navigateToResearchOverview(state.research) : null"
                    size="30" :title="$t('words.research')">mdi-view-grid</v-icon>
        </div>
    </v-navigation-drawer>
</template>


<style scoped>

@import '../../assets/main.css';

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

.lara-fixed-icon {
    position: absolute;
    top: 45vh;
}

.lara-fixed-icon-right {
    left: 260px;
}

</style>