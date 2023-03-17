<script setup lang="ts">
import LaraButton from '../basic/LaraButton.vue';
import TagComponent from './TagComponent.vue';

import {useOpenPaperStore} from '@/stores/openPaper'
import {reactive} from '@vue/reactivity';
import {toRaw} from 'vue';

import {PaperApiHandler} from '@/api/Paper/PaperApiHandler';

import type {SavedPaper} from '@/model/SavedPaper';
import type {Paper} from '@/model/Paper';
import {OpenPaper} from '@/stores/model/OpenPaper';
import {SaveState} from '@/model/SaveState';
import type {Research} from '@/model/Research';
import {useOpenResearchStore} from '@/stores/openResearch';
import type {Author} from '@/model/Author';
import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";

const MAX_NUMBER_OF_AUTHORS = 2;
const MAX_NUMBER_DISPLAYED = 3;

defineEmits<{
    (event: 'bigger'): void,
    (event: 'toggle'): void
}>();

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
let detailSidebarState: { comment: string, relevance: number | undefined } = reactive({
    comment: detailState.openPaper?.saved ? detailState.openPaper.savedPaper!.comment : "",
    relevance: detailState.openPaper?.saved ? detailState.openPaper.savedPaper!.relevance : 0
});


// Methods to change comment/tag/saveState/relevance of the paper currently viewed
let changeComment = async (comment: string): Promise<void> => {
    if (comment == "" || detailState.openPaper == null) {
        console.error("CHANGE_COMMENT : Argument null / undefined");
        return;
    }

    if (detailState.openPaper.savedPaper == null) {
        console.error("CHANGE_COMMENT : No saved paper");
        return;
    }
    
    console.debug("Changed comment to '" + comment + "'");

    await PaperApiHandler.changeComment(detailState.openPaper.savedPaper, comment);

    // update open paper of open research
    let paper = await PaperApiHandler.getDetails(detailState.openPaper.savedPaper.paper.paperId, researchState.research!.id) as SavedPaper;
    detailState.openPaper.savedPaper.comment = paper.comment;
    useOpenResearchStore().setResearchPaper(toRaw(paper));
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
    let paper = await PaperApiHandler.getDetails(detailState.openPaper.savedPaper.paper.paperId, researchState.research!.id) as SavedPaper;
    detailState.openPaper.savedPaper.relevance = paper.relevance;
    detailSidebarState.relevance = paper.relevance;
    useOpenResearchStore().setResearchPaper(toRaw(paper));
}

let changeSaveState = async (savedPaper: SavedPaper | undefined, state: SaveState): Promise<void> => {
    if (savedPaper === undefined) {
        console.error("CHANGE_SAVE_STATE : No valid savedPaper provided");
        return;
    }
    
    await PaperApiHandler.changeSaveState(savedPaper, state);

    let paper = await PaperApiHandler.getDetails(savedPaper.paper.paperId, researchState.research!.id) as SavedPaper;
    detailState.openPaper!.savedPaper!.saveState = paper.saveState;
    savedPaper.saveState = paper.saveState;
    useOpenResearchStore().setResearchPaper(paper);
}


// Method to create a saved Paper from a paper with a given saveState
let createSavedPaper = async (paper: Paper | null | undefined, state: SaveState): Promise<void> => {
    if (paper == null || paper == undefined || researchState.research == null) {
        console.error("CREATE_SAVE_PAPER : Argument null / undefined");
        return;
    }
    
    console.debug("Save Paper : " + paper.paperId + " = " + state);

    await ResearchApiHandler.savePaper(researchState.research, paper as Paper, state);

    let savedPaper: SavedPaper = await PaperApiHandler.getDetails(paper.paperId, researchState.research.id) as SavedPaper;
    openResearchStore.addResearchPaper(savedPaper);

    let openPaper = new OpenPaper(undefined, savedPaper, true);
    openPaperStore.setPaper(openPaper);
    detailState.openPaper = openPaper;
    console.debug("openPaper: ", detailState.openPaper);
}


// state and methods to accumulate recommendations, citations and references of openPaper
let recommendationsStore: { recommendations: Paper[], citations: Paper[], references: Paper[] } = reactive({
    recommendations: [],
    citations: [],
    references: []
});

let getRecommendations = async () => {
    let paper = detailState.openPaper?.getPaper();
    let research = researchState.research;
    if (paper == undefined || research == undefined) {
        console.debug("paper or research undefined");
        return;
    }
    recommendationsStore.recommendations = await PaperApiHandler.getRecommendations(paper, []);
}
getRecommendations();

let getCitations = async () => {
    let citations = await PaperApiHandler.getCitations(detailState.openPaper!.getPaper() as Paper, []);
    recommendationsStore.citations = citations;
}
getCitations();

let getReferences = async () => {
    let references = await PaperApiHandler.getReferences(detailState.openPaper!.getPaper() as Paper, []);
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
const props = defineProps<{ openPaper: OpenPaper, biggerListShown: boolean }>();

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
                    <v-textarea hide-details variant="outlined" class="mt-2 lara-field" v-model="detailSidebarState.comment"></v-textarea>
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
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState != SaveState.hidden"
                                class="mr-10 mt-6 lara-hide-button" :title="$t('words.hide')"
                                @click="detailState.openPaper !== null ? changeSaveState(detailState.openPaper?.savedPaper, SaveState.hidden) : null">mdi-eye-off</v-icon>
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState == SaveState.hidden"
                                class="mr-10 mt-6 lara-hide-button" :title="$t('detailSidebar.add')"
                                @click="detailState.openPaper !== null ? changeSaveState(detailState.openPaper?.savedPaper, SaveState.added) : null">mdi-eye</v-icon>
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
                    <lara-button type="secondary" @click="detailState.openPaper !== null ? createSavedPaper(detailState.openPaper?.paper, SaveState.enqueued) : null" id="detail-sidebar-enqueue-button">{{ $t('detailSidebar.enqueue') }}</lara-button>
                    <lara-button class="mt-2" type="primary" @click="detailState.openPaper !== null ? createSavedPaper( detailState.openPaper?.paper, SaveState.added) : null" id="detail-sidebar-add-button">{{ $t('detailSidebar.add') }}</lara-button>
                    <lara-button class="lara-hide-button mt-2" type="outline" @click="detailState.openPaper !== null ? createSavedPaper(detailState.openPaper?.paper, SaveState.hidden) : null" id="detail-sidebar-hide-button">
                        <v-icon>mdi-eye-off</v-icon>
                    </lara-button>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>


            <!-- Section for the recommendations, citations and references of the open paper -->
            <div class="mt-3" v-show="!props.biggerListShown">
                <div>
                    <span class="text-h5 font-weight-bold" id="sidebar-recommendations">{{ $t('detailSidebar.recommendations') }}</span>

                    <div class="mb-2" v-for="(recommendation, index) in recommendationsStore.recommendations" :key="index">
                        <router-link class="lara-recommendation-link" v-if="index < 3"
                                     :to="{ name: 'paperDetails', query: {paper: recommendation.paperId}}"
                                     @click="openPaperStore.setPaper(new OpenPaper(recommendation, undefined, false))" id="recommendations-link">
                            {{ recommendation.title }}
                        </router-link>
                    </div>
                    <a v-if="recommendationsStore.recommendations.length > MAX_NUMBER_DISPLAYED"  @click="$emit('bigger')"
                       class="text-grey lara-no-decoration cursor-pointer">
                        {{ $t('detailSidebar.more', { n: recommendationsStore.recommendations.length - MAX_NUMBER_DISPLAYED }) }}
                    </a>
                </div>
                <div class="mt-4">
                    <span class="text-h5 font-weight-bold" id="sidebar-citations">{{ $t('detailSidebar.citations') }}</span>

                    <div class="mb-2" v-for="(citation, index) in recommendationsStore.citations" :key="index">
                        <router-link class="lara-recommendation-link" v-if="index < 3"
                                     :to="{ name: 'paperDetails', query: {paper: citation.paperId}}" 
                                     @click="openPaperStore.setPaper(new OpenPaper(citation, undefined, false))" id="citations-link">
                            {{ citation.title }}
                        </router-link>
                    </div>
                    <a v-if="recommendationsStore.citations.length > MAX_NUMBER_DISPLAYED" @click="$emit('bigger')"
                       class="text-grey lara-no-decoration cursor-pointer">
                        {{ $t('detailSidebar.more', { n: recommendationsStore.citations.length - MAX_NUMBER_DISPLAYED }) }}
                    </a>
                </div>
                <div class="mt-4">
                    <span class="text-h5 font-weight-bold" id="sidebar-references">{{ $t('detailSidebar.references') }}</span>

                    <div class="mb-2" v-for="(reference, index) in recommendationsStore.references" :key="index">
                        <router-link class="lara-recommendation-link" v-if="index < 3"
                                     :to="{ name: 'paperDetails', query: {paper: reference.paperId}}"
                                     @click="openPaperStore.setPaper(new OpenPaper(reference, undefined, false))" id="references-link">
                            {{ reference.title }}
                        </router-link>
                    </div>
                    <a v-if="recommendationsStore.references.length > MAX_NUMBER_DISPLAYED" @click="$emit('bigger')"
                       class="text-grey lara-no-decoration cursor-pointer">
                        {{ $t('detailSidebar.more', { n: recommendationsStore.references.length - MAX_NUMBER_DISPLAYED }) }}
                    </a>
                </div>

                <lara-button class="mt-2 mb-4" type="outline" @click="$emit('toggle')">
                    {{ $t('detailSidebar.bigger') }}
                </lara-button>
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