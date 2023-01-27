<script setup lang="ts">

import LaraButton from './basic/LaraButton.vue';

import type { OpenPaper } from '../stores/model/OpenPaper';

import { useOpenPaperStore } from '../stores/openPaper'
import { reactive } from '@vue/reactivity';

import type { SavedPaper } from '../model/SavedPaper';
import type { Paper } from '../model/Paper';

import { watch } from 'vue';
import { SaveState } from '../model/SaveState';

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
let changeComment = (comment: string | undefined): void => {
    if (comment == undefined) {
        return;
    }
    
    console.debug("Change comment " + comment);

    // TODO Call API to change the comment and force reload
}

// Method to change the relevance of a paper
let changeRelevance = (relevance: number | undefined): void => {
    if (relevance == undefined) {
        return;
    }

    console.debug("Change relevance : " + relevance);

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
let deleteTag = (id: string): void => {
    console.debug("Close Tag" + id);

    // TODO Call API to delete tag and force reload
}

// Method to create a saved Paper from a paper with a given saveState
let createSavedPaper = (paper: Paper | null | undefined, state: SaveState): void => {
    if (paper == null || paper == undefined) {
        return;
    }

    console.debug("Save Paper : " + paper.paperId + " = " + state);

    // TODO Call API to create paper and force reload
}

// Method to hide a savedPaper
let hidePaper = (paper: SavedPaper | undefined | null): void => {
    if (paper == null || paper == undefined) {
        return;
    }

    console.debug("Hide paper : " + paper.research.id + paper.paper.paperId);

    // TODO Call API to hide savedPaper and force reload
}

// Method to show / add a savedPaper
let showPaper = (paper: SavedPaper | undefined | null): void => {
    if (paper == null || paper == undefined) {
        return;
    }

    console.debug("Show paper : " + paper.research.id + paper.paper.paperId);

    // TODO Call API to add paper and force reload
}

</script>

<template>
    <v-navigation-drawer location="right" width="400">
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
                        <v-chip v-for="(tag, index) in detailState.openPaper?.savedPaper?.tags" :key="index" @click:close="deleteTag(tag.id)" closable :color="tag.color" class="lara-chip mr-2 mb-1">{{ tag.name }}</v-chip>
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
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState != SaveState.hidden" class="lara-hide-button" @click="hidePaper(detailState.openPaper?.savedPaper)">mdi-eye-off</v-icon>
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState == SaveState.hidden" class="lara-hide-button" @click="hidePaper(detailState.openPaper?.savedPaper)">mdi-eye</v-icon>
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
                    <lara-button type="primary" @click="createSavedPaper(detailState.openPaper?.paper, SaveState.added)">{{ $t('detailSidebar.add') }}</lara-button>
                    <lara-button class="mt-2" type="secondary" @click="createSavedPaper(detailState.openPaper?.paper, SaveState.enqueued)">{{ $t('detailSidebar.enqueue') }}</lara-button>
                    <lara-button class="lara-hide-button mt-2" type="outline" @click="createSavedPaper(detailState.openPaper?.paper, SaveState.hidden)">
                        <v-icon>mdi-eye-off</v-icon>
                    </lara-button>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>



            <!-- Section for the recommendations of the paper currently viewes -->
            <div>
                
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

</style>