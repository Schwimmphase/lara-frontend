<script setup lang="ts">

import LaraButton from './basic/LaraButton.vue';

import type { OpenPaper } from '../stores/model/OpenPaper';

import { useOpenPaperStore } from '../stores/openPaper'
import { reactive } from '@vue/reactivity';

import type { SavedPaper } from '../model/SavedPaper';
import type { Paper } from '../model/Paper';

// TODO nur wegen Test
import { testOpenPaper, testOpenPaper2 } from '../model/_testResearch';
import { watch } from 'vue';
import { SaveState } from '../model/SaveState';

let openPaperStore = useOpenPaperStore();

// TODO Nur wegen Test man.....
openPaperStore.setPaper(testOpenPaper2);

// Set the openPaper to the openPaper saved in the store
let openPaper: OpenPaper = openPaperStore.getPaper;
console.log(openPaper)


let commentState: { data: string } = reactive({
    data: openPaper.saved ? openPaper.savedPaper?.comment.text : ""
});

let relevanceState: { data: number } = reactive({
    data: openPaper.saved ? openPaper.savedPaper?.relevance : 0
});

// Method to change comment of the paper currently viewed
let changeComment = (comment: string): void => {
    console.log("Change comment " + comment);
}

// Method to change the relevance of a paper
let changeRelevance = (relevance: number): void => {
    console.log("Change relevance : " + relevance);
}

// Watcher for the state of the relevance
watch(relevanceState, async (value) => {
    changeRelevance(value.data);
});

let deleteTag = (id: string): void => {
    console.log("Close Tag" + id);
}

let createSavedPaper = (paper: Paper, state: SaveState) => {
    console.debug("Save Paper : " + paper.id + " = " + state);
}

let hidePaper = (paper: SavedPaper) => {
    console.debug("Hide paper : " + paper.research.id + paper.paper.id);
}

let showPaper = (paper: SavedPaper) => {
    console.debug("Show paper : " + paper.research.id + paper.paper.id);
}

</script>

<template>
    <v-navigation-drawer location="right" width="400">
        <div class="mx-8 my-3">

            <!-- Section for a saved paper -->
            <div v-if="openPaper.saved">
                <div>
                    <span class="text-h5">{{ $t('detailSidebar.informations') }}</span><br>
                    <div>
                        <span v-for="(author, index) in openPaper.savedPaper?.paper.authors" :key="index" class="font-weight-bold">{{ author.name }}</span>
                    </div>
                    <span>{{ openPaper.savedPaper?.paper.year }} - {{ openPaper.savedPaper?.paper.venue }} - {{ openPaper.savedPaper?.paper.citationCount }} mal zitiert - {{ openPaper.savedPaper?.paper.referenceCount }} Referenzen</span>
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
                        <v-chip v-for="(tag, index) in openPaper.savedPaper?.tags" :key="index" @click:close="deleteTag(tag.id)" closable :color="tag.color" class="lara-chip mr-2 mb-1">{{ tag.name }}</v-chip>
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
                        <v-icon v-if="openPaper.savedPaper?.saveState != SaveState.hidden" class="lara-hide-button" @click="hidePaper(openPaper.savedPaper)">mdi-eye-off</v-icon>
                        <v-icon v-if="openPaper.savedPaper?.saveState == SaveState.hidden" class="lara-hide-button" @click="hidePaper(openPaper.savedPaper)">mdi-eye</v-icon>
                    </div>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>
            
            <!-- Section for a paper thats not saved -->
            <div v-if="!openPaper.saved">
                <div>
                    <span class="text-h5">{{ $t('detailSidebar.informations') }}</span><br>
                    <div>
                        <!-- TODO SOBALD DAS FELD AUTHORS HEIßT WIEDER RAUSNEHMEN!! -->
                        <span v-for="(author, index) in openPaper.paper?.author" :key="index" class="font-weight-bold">{{ author.name }}</span>
                    </div>
                    <span>{{ openPaper.paper?.year }} - {{ openPaper.paper?.venue }} - {{ $t('detailSidebar.citationCount', { n: openPaper.paper?.citationCount}) }} - {{ $t('detailSidebar.referenceCount', {n: openPaper.paper?.referenceCount}) }}</span>
                    <v-divider class="my-3"></v-divider>
                </div>
                
                <div class="mt-4">
                    <lara-button type="primary" @click="createSavedPaper(openPaper.paper, SaveState.added)">{{ $t('detailSidebar.add') }}</lara-button>
                    <lara-button class="mt-2" type="secondary" @click="createSavedPaper(openPaper.paper, SaveState.enqueued)">{{ $t('detailSidebar.enqueue') }}</lara-button>
                    <lara-button class="lara-hide-button mt-2" @click="createSavedPaper(openPaper.paper, SaveState.hidden)">
                        <v-icon>mdi-eye-off</v-icon>
                    </lara-button>
                    <v-divider class="my-3"></v-divider>
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

</style>