<script setup lang="ts">

import LaraButton from './basic/LaraButton.vue';

import { useOpenPaperStore } from '../stores/openPaper'
import { reactive } from '@vue/reactivity';
import { watch } from 'vue';

import { ResearchApiHandler } from '@/api/Research/ResearchApiHandler';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';

import type { SavedPaper } from '../model/SavedPaper';
import type { Paper } from '../model/Paper';
import { Comment } from '../model/Comment'
import type { Tag } from '../model/Tag'
import type { OpenPaper } from '../stores/model/OpenPaper';
import { SaveState } from '../model/SaveState';
import type { Research } from '../model/Research';
import { useOpenResearchStore } from '@/stores/openResearch';


// Store for the openResearch
let researchStore = useOpenResearchStore();

// State for the research currently opened
let researchState: { research: Research | null } = reactive({
    research: null,
});

researchStore.$subscribe((mutation, state) => {
    // If the research is changed, set the state for the openResearch to that new research
    researchState.research = state.openResearch;
});

// Use the store for the openPaper
let openPaperStore = useOpenPaperStore();

// State for the openPaper
let detailState: { openPaper: OpenPaper | null} = reactive({
    openPaper: null
});

openPaperStore.$subscribe((mutation, state) => {
    // When a change in the paper is detected, update the state
    detailState.openPaper = state.paper;
});

// Set the openPaperState to the openPaper saved in the store
detailState.openPaper = openPaperStore.getPaper;

// State for the comment of the openPaper
let commentState: { data: string | undefined } = reactive({
    data: detailState.openPaper?.saved ? detailState.openPaper.savedPaper?.comment.text : ""
});

// State for the relevance of the openPaper
let relevanceState: { data: number | undefined } = reactive({
    data: detailState.openPaper?.saved ? detailState.openPaper.savedPaper?.relevance : 0
});


// Method to change comment of the paper currently viewed
let changeComment = (text: string | undefined): void => {
    if (text == undefined || detailState.openPaper == null) {
        console.error("CHANGE_COMMENT : Argument null / undefined");
        return;
    }

    if (detailState.openPaper.savedPaper == null) {
        console.error("CHANGE_COMMENT : No saved paper");
        return;
    }
    
    console.debug("Change comment " + text);

    PaperApiHandler.changeComment(detailState.openPaper.savedPaper, new Comment(text));

    // TODO Call API to change the comment and force reload
}

// Method to change the relevance of a paper
let changeRelevance = (relevance: number | undefined): void => {
    if (relevance == undefined || detailState.openPaper == null) {
        console.error("CHANGE_RELEVANCE : Argument null / undefined");
        return;
    }

    if (detailState.openPaper.savedPaper == null) {
        console.error("CHANGE_RELEVANCE : No saved paper");
        return;
    }

    console.debug("Change relevance : " + relevance);

    PaperApiHandler.changeRelevance(detailState.openPaper.savedPaper, relevance);

    // TODO Call API to change the relevance and force reload
}

// Watcher for the state of the relevance
watch(relevanceState, async (value) => {
    if (value == undefined) {
        return;
    }

    changeRelevance(value.data);
});

// Method to delete a given tag
let deleteTag = (tag: Tag): void => {
    if (detailState.openPaper == null || detailState.openPaper.savedPaper == null) {
        console.error("DELETE_TAG : No saved paper");
        return;
    }

    console.debug("Close Tag" + tag.name);

    PaperApiHandler.removeTag(detailState.openPaper.savedPaper, tag);

    // TODO Call API to delete tag and force reload
}

// Method to create a saved Paper from a paper with a given saveState
let createSavedPaper = (paper: Paper | null | undefined, state: SaveState): void => {
    if (paper == null || paper == undefined || researchState.research == null) {
        console.error("CREATE_SAVE_PAPER : Argument null / undefined");
        return;
    }

    console.debug("Save Paper : " + paper.paperId + " = " + state);

    ResearchApiHandler.savePaper(researchState.research, paper, state);

    // TODO Call API to create paper and force reload
}

let changeSaveState = (savedPaper: SavedPaper | null, state: SaveState): void => {
    if (savedPaper == null) {
        console.error("CHANGE_SAVE_STATE : No valid savedPaper provided");
        return;
    }
    
    PaperApiHandler.changeSaveState(savedPaper, state);

    // TODO Call API and force reload
}

// Method to get the recommendations, citations and references of the openedPaper
let getRecommendations = () => {
    console.log("getRecommendations")

    // TODO Get recommendations from API and display them
}

</script>

<template>
    <v-navigation-drawer location="right" width="400" permanent>
        <div class="mx-8 my-3">

            <!-- Section for a saved paper -->
            <div v-if="detailState.openPaper?.saved">
                <div>
                    <span class="text-h5">{{ $t('detailSidebar.informations') }}</span><br>
                    <div>
                        <!-- TODO Sobald AUTHORS wieder rausnehmen -->
                        <span v-for="(author, index) in detailState.openPaper?.savedPaper?.paper.author" :key="index" class="font-weight-bold">{{ author.name }}</span>
                    </div>
                    <span>{{ detailState.openPaper?.savedPaper?.paper.year }} - {{ detailState.openPaper?.savedPaper?.paper.venue }} - {{ detailState.openPaper.savedPaper?.paper.citationCount }} mal zitiert - {{ detailState.openPaper.savedPaper?.paper.referenceCount }} Referenzen</span>
                    <v-divider class="my-3"></v-divider>
                </div>

                <div class="mt-4">
                    <span class="text-h5">{{ $t('detailSidebar.comments') }}</span>
                    <v-textarea hide-details variant="outlined" class="mt-2 lara-field" v-model="commentState.data"></v-textarea>
                    <lara-button class="mt-2" type="primary" @click="changeComment(commentState.data)">{{ $t('detailSidebar.save') }}</lara-button>
                    <v-divider class="my-3"></v-divider>
                </div>

                <div class="mt-4">
                    <span class="text-h5">{{ $t('detailSidebar.tags') }}</span>
                    <div class="mt-2">
                        <v-chip v-for="(tag, index) in detailState.openPaper?.savedPaper?.tags" :key="index" @click:close="deleteTag(tag)" closable :color="tag.color" class="lara-chip mr-2 mb-1">{{ tag.name }}</v-chip>
                    </div>
                    <v-divider class="my-3"></v-divider>
                </div>

                <div class="mt-4">
                    <span class="text-h5">{{ $t('detailSidebar.relevance') }}</span>
                    <div>
                        <v-rating
                            v-model="relevanceState.data"
                            length="3"
                            size="65"
                            full-icon="mdi-star"
                            empty-icon="mdi-star-outline"
                            color="orange"
                        ></v-rating>
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState != SaveState.hidden" class="lara-hide-button" @click="detailState.openPaper !== null ? changeSaveState(detailState.openPaper.savedPaper, SaveState.hidden) : null">mdi-eye-off</v-icon>
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState == SaveState.hidden" class="lara-hide-button" @click="detailState.openPaper !== null ? changeSaveState(detailState.openPaper.savedPaper, SaveState.hidden) : null">mdi-eye</v-icon>
                    </div>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>
            
            <!-- Section for a paper thats not saved -->
            <div v-if="!detailState.openPaper?.saved">
                <div>
                    <span class="text-h5">{{ $t('detailSidebar.informations') }}</span><br>
                    <div>
                        <!-- TODO SOBALD DAS FELD AUTHORS HEIßT WIEDER RAUSNEHMEN!! -->
                        <span v-for="(author, index) in detailState.openPaper?.paper?.author" :key="index" class="font-weight-bold">{{ author.name }}</span>
                    </div>
                    <span>{{ detailState.openPaper?.paper?.year }} - {{ detailState.openPaper?.paper?.venue }} - {{ $t('detailSidebar.citationCount', { n: detailState.openPaper?.paper?.citationCount}) }} - {{ $t('detailSidebar.referenceCount', {n: detailState.openPaper?.paper?.referenceCount}) }}</span>
                    <v-divider class="my-3"></v-divider>
                </div>
                
                <div class="mt-4">
                    <lara-button type="primary" @click="detailState.openPaper !== null ? createSavedPaper( detailState.openPaper.paper, SaveState.added) : null">{{ $t('detailSidebar.add') }}</lara-button>
                    <lara-button class="mt-2" type="secondary" @click="detailState.openPaper !== null ? createSavedPaper(detailState.openPaper.paper, SaveState.enqueued) : null">{{ $t('detailSidebar.enqueue') }}</lara-button>
                    <lara-button class="lara-hide-button mt-2" type="outline" @click="detailState.openPaper !== null ? createSavedPaper(detailState.openPaper.paper, SaveState.hidden) : null">
                        <v-icon>mdi-eye-off</v-icon>
                    </lara-button>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>



            <!-- Section for the recommendations of the paper currently viewed -->
            <div class="mt-3">
                <!-- TODO Use recommendations from API -->
                <div>
                    <span class="text-h5 font-weight-bold">{{ $t('detailSidebar.recommendations') }}</span><br>

                </div>
                <div class="mt-2">
                    <span class="text-h5 font-weight-bold">{{ $t('detailSidebar.citations') }}</span><br>

                    <router-link class="text-h6 lara-recommendation-link" :to="{ name: 'paperDetails', query: {paper: '12345'}}">Titel 1 von Paper</router-link><br>
                    <router-link class="text-h6 lara-recommendation-link" :to="{ name: 'paperDetails', query: {paper: '12345'}}">Titel 1 von Paper</router-link><br>
                </div>
                <div class="mt-2">
                    <span class="text-h5 font-weight-bold">{{ $t('detailSidebar.references') }}</span><br>
                    
                </div>
            </div>
        </div>
    </v-navigation-drawer>
</template>

<style scoped>

.lara-hide-button {
    color: #000;
    transition: color ease-in-out 0.3s;
}

.lara-hide-button:hover {
    color: rgb(175, 175, 175);
}

.lara-recommendation-link {
    color: #000;
    transition: color ease-in-out 0.3s;
    text-decoration: none;
}

.lara-recommendation-link:hover {
    cursor: pointer;
    color: rgb(175, 175, 175);
    text-decoration: none;
}

</style>