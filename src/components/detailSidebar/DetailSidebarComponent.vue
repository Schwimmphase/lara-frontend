<script setup lang="ts">
import LaraButton from '../basic/LaraButton.vue';
import TagComponent from './TagComponent.vue';

import { useOpenPaperStore } from '../../stores/openPaper'
import { reactive } from '@vue/reactivity';
import { toRaw } from 'vue';

import { ResearchApiHandler } from '@/api/Research/ResearchApiHandler';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';

import type { SavedPaper } from '../../model/SavedPaper';
import type { Paper } from '../../model/Paper';
import type { Comment } from '../../model/Comment'
import { OpenPaper } from '../../stores/model/OpenPaper';
import { SaveState } from '../../model/SaveState';
import type { Research } from '../../model/Research';
import { useOpenResearchStore } from '@/stores/openResearch';
import router from '@/router';
import type { Author } from '@/model/Author';

const MAX_NUMBER_OF_AUTHORS = 2;

// Store for the openResearch
let openResearchStore = useOpenResearchStore();

// State for the research currently opened
let researchState: { research: Research | undefined } = reactive({
    research: undefined,
});

// Use the store for the openPaper
let openPaperStore = useOpenPaperStore();

let detailState: { openPaper: OpenPaper | undefined} = reactive({
    openPaper: undefined
});

// Set the openResearch/openPaper state to the openResearch/openPaper saved in the store
researchState.research = openResearchStore.getResearch;
detailState.openPaper = openPaperStore.paper;
openResearchStore.$subscribe((mutation, state) => {
    // If the research is changed, set the state for the openResearch to that new research
    console.log("RECHERCHE GEÄNDERT");
    researchState.research = state.openResearch;
});
openPaperStore.$subscribe((mutation, state) => {
    // When a change in the paper is detected, update the state
    detailState.openPaper = state.paper;
});

// State for the comment/relevance of the open paper
let detailSidebarState: { comment: Comment | undefined, relevance: number | undefined } = reactive({
    comment: detailState.openPaper?.saved ? detailState.openPaper.savedPaper!.comment : undefined,
    relevance: detailState.openPaper?.saved ? detailState.openPaper.savedPaper!.relevance : 0
});


// Methods to change comment/tag/saveState/relevance of the paper currently viewed
let changeComment = async (comment: Comment | undefined): Promise<void> => {
    if (comment == undefined || detailState.openPaper == null) {
        console.error("CHANGE_COMMENT : Argument null / undefined");
        return;
    }

    if (detailState.openPaper.savedPaper == null) {
        console.error("CHANGE_COMMENT : No saved paper");
        return;
    }
    
    console.debug("Changed comment to '" + comment.text + "'");

    await PaperApiHandler.changeComment(detailState.openPaper.savedPaper, comment);

    detailState.openPaper.savedPaper.comment.text = comment.text;
    useOpenResearchStore().setResearchPaper(toRaw(detailState.openPaper.savedPaper));
}

let changeRelevance = async (relevance: number | string | undefined): Promise<void> => {
    if (relevance == undefined || detailState.openPaper == null) {
        console.error("CHANGE_RELEVANCE : Argument null / undefined");
        return;
    }

    if (detailState.openPaper.savedPaper == null) {
        console.error("CHANGE_RELEVANCE : No saved paper");
        return;
    }

    console.debug("Change relevance:", relevance);

    await PaperApiHandler.changeRelevance(detailState.openPaper.savedPaper, relevance as number);

    // update open paper of open research
    detailState.openPaper.savedPaper.relevance = relevance as number;
    useOpenResearchStore().setResearchPaper(toRaw(detailState.openPaper.savedPaper));
}

let changeSaveState = async (savedPaper: SavedPaper | undefined, state: SaveState): Promise<void> => {
    if (savedPaper === undefined) {
        console.error("CHANGE_SAVE_STATE : No valid savedPaper provided");
        return;
    }
    
    await PaperApiHandler.changeSaveState(savedPaper, state);

    savedPaper.saveState = state;
    useOpenResearchStore().setResearchPaper(savedPaper);
}


// Method to create a saved Paper from a paper with a given saveState
let createSavedPaper = async (paper: Paper | null | undefined, state: SaveState): Promise<void> => {
    if (paper == null || paper == undefined || researchState.research == null) {
        console.error("CREATE_SAVE_PAPER : Argument null / undefined");
        return;
    }
    
    console.debug("Save Paper : " + paper.paperId + " = " + state);
    
    await ResearchApiHandler.savePaper(researchState.research, paper, state);
    router.go(0); // reload the page
}


// state and methods to accumulate recommendations, citations and references of openPaper
let recommendationsStore: { recommendations: Paper[], citations: Paper[], references: Paper[] } = reactive({
    recommendations: [],
    citations: [],
    references: []
});

let getRecommendations = async () => {
    let paper = detailState.openPaper?.paper;
    let research = detailState.openPaper?.savedPaper?.research;
    if (paper == undefined || research == undefined) {
        return;
    }
    let recommendations = await PaperApiHandler.getRecommendations(paper, research, []);
    recommendationsStore.recommendations = recommendations;
}
getRecommendations();

let getCitations = async () => {
    let citations = await PaperApiHandler.getCitations(detailState.openPaper!.savedPaper!.paper, useOpenResearchStore().getResearch!, []);
    recommendationsStore.citations = citations;
}
getCitations();

let getReferences = async () => {
    let references = await PaperApiHandler.getReferences(detailState.openPaper!.savedPaper!.paper, useOpenResearchStore().getResearch!, []);
    recommendationsStore.references = references;
}
getReferences();

// Method to format the authors of the open paper
let getAuthorsString = (authors: Author[] | undefined) => {
    if (authors == undefined) {
        return "";
    } else if (authors.length > MAX_NUMBER_OF_AUTHORS) {
        return authors.slice(0, MAX_NUMBER_OF_AUTHORS).map(author => author.name).join(", ") + " et al.";
    } else {
        return authors.map(author => author.name).join(", ");
    }
}

// prop to be passed down to TagComponent
const props = defineProps<{ openPaper: OpenPaper }>();

</script>


<template>
    <v-navigation-drawer location="right" width="400" permanent>
        <div class="mx-8 my-3">

            <!-- Information if the open paper is saved -->
            <div v-if="detailState.openPaper?.saved">
                <div>
                    <span class="text-h5">{{ $t('detailSidebar.information') }}</span><br>
                    <div>
                        <span class="font-weight-bold">{{ getAuthorsString(detailState.openPaper?.savedPaper?.paper.authors) }}</span>
                    </div>
                    <span>{{ detailState.openPaper?.savedPaper?.paper.year }} - {{ detailState.openPaper?.savedPaper?.paper.venue }} - {{ detailState.openPaper.savedPaper?.paper.citationCount }} mal zitiert - {{ detailState.openPaper.savedPaper?.paper.referenceCount }} Referenzen</span>
                    <v-divider class="my-3"></v-divider>
                </div>

                <div class="mt-4">
                    <span class="text-h5">{{ $t('detailSidebar.comments') }}</span>
                    <v-textarea hide-details variant="outlined" class="mt-2 lara-field" v-model="detailSidebarState.comment!.text"></v-textarea>
                    <lara-button class="mt-2" type="primary" @click="changeComment(toRaw(detailSidebarState.comment))">{{ $t('detailSidebar.save') }}</lara-button>
                    <v-divider class="my-3"></v-divider>
                </div>

                <div class="mt-4">
                    <span class="text-h5">{{ $t('detailSidebar.tags') }}</span>
                    <div class="mt-2">
                        <tag-component :open-paper="props.openPaper.savedPaper!"></tag-component>
                    </div>
                    <v-divider class="my-3"></v-divider>
                </div>

                <div class="mt-4">
                    <span class="text-h5">{{ $t('detailSidebar.relevance') }}</span>
                    <div class="d-flex">
                        <v-rating
                            v-model="detailSidebarState.relevance"
                            @update:modelValue="changeRelevance"
                            length="3"
                            size="75"
                            full-icon="mdi-star"
                            empty-icon="mdi-star-outline"
                            color="orange"
                            hover
                        ></v-rating>
                        <v-spacer></v-spacer>
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState != SaveState.hidden" class="mr-10 mt-6 lara-hide-button" @click="detailState.openPaper !== null ? changeSaveState(detailState.openPaper?.savedPaper, SaveState.hidden) : null">mdi-eye-off</v-icon>
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState == SaveState.hidden" class="mr-10 mt-6 lara-hide-button" @click="detailState.openPaper !== null ? changeSaveState(detailState.openPaper?.savedPaper, SaveState.added) : null">mdi-eye</v-icon>
                    </div>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>
            
            <!-- Information if the open paper is not saved -->
            <div v-else>
                <div>
                    <span class="text-h5">{{ $t('detailSidebar.information') }}</span><br>
                    <div>
                        <span class="font-weight-bold">{{ getAuthorsString(detailState.openPaper?.paper?.authors) }}</span>
                    </div>
                    <span>{{ detailState.openPaper?.paper?.year }} - {{ detailState.openPaper?.paper?.venue }} - {{ $t('detailSidebar.citationCount', { n: detailState.openPaper?.paper?.citationCount}) }} - {{ $t('detailSidebar.referenceCount', {n: detailState.openPaper?.paper?.referenceCount}) }}</span>
                    <v-divider class="my-3"></v-divider>
                </div>
                
                <div class="mt-4">
                    <lara-button type="primary" @click="detailState.openPaper !== null ? createSavedPaper( detailState.openPaper?.paper, SaveState.added) : null">{{ $t('detailSidebar.add') }}</lara-button>
                    <lara-button class="mt-2" type="secondary" @click="detailState.openPaper !== null ? createSavedPaper(detailState.openPaper?.paper, SaveState.enqueued) : null">{{ $t('detailSidebar.enqueue') }}</lara-button>
                    <lara-button class="lara-hide-button mt-2" type="outline" @click="detailState.openPaper !== null ? createSavedPaper(detailState.openPaper?.paper, SaveState.hidden) : null">
                        <v-icon>mdi-eye-off</v-icon>
                    </lara-button>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>


            <!-- Section for the recommendations, citations and references of the open paper -->
            <div class="mt-3">
                <div>
                    <span class="text-h5 font-weight-bold">{{ $t('detailSidebar.recommendations') }}</span><br>

                    <div v-for="(recommendation, index) in recommendationsStore.recommendations" :key="index">
                        <router-link class="text-h6 lara-recommendation-link" :to="{ name: 'paperDetails', query: {paper: recommendation.paperId}}" @click="openPaperStore.setPaper(new OpenPaper(recommendation, undefined, false))">{{ recommendation.title }}</router-link><br>
                    </div>
                </div>
                <div class="mt-2">
                    <span class="text-h5 font-weight-bold">{{ $t('detailSidebar.citations') }}</span><br>

                    <div v-for="(citation, index) in recommendationsStore.citations" :key="index">
                        <router-link class="text-h6 lara-recommendation-link" :to="{ name: 'paperDetails', query: {paper: citation.paperId}}" @click="openPaperStore.setPaper(new OpenPaper(citation, undefined, false))">{{ citation.title }}</router-link><br>
                    </div>
                </div>
                <div class="mt-2">
                    <span class="text-h5 font-weight-bold">{{ $t('detailSidebar.references') }}</span><br>

                    <div v-for="(reference, index) in recommendationsStore.references" :key="index">
                        <router-link class="text-h6 lara-recommendation-link" :to="{ name: 'paperDetails', query: {paper: reference.paperId}}" @click="openPaperStore.setPaper(new OpenPaper(reference, undefined, false))">{{ reference.title }}</router-link><br>
                    </div>
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