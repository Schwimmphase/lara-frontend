<script setup lang="ts">

import LaraButton from './basic/LaraButton.vue';

import type { OpenPaper } from '../stores/model/OpenPaper';

import { useOpenPaperStore } from '../stores/openPaper'
import { reactive } from '@vue/reactivity';

import type { SavedPaper } from '../model/SavedPaper';
import type { Paper } from '../model/Paper';

// TODO nur wegen Test
import { testOpenPaper } from '../model/_testResearch';
import { watch } from 'vue';

let openPaperStore = useOpenPaperStore();

// TODO Nur wegen Test man.....
openPaperStore.setPaper(testOpenPaper);


let commentState: { data: string } = reactive({
    data: ""
});

let relevanceState: { data: number } = reactive({
    data: 0
});

// Method to change comment of the paper currently viewed
let changeComment = (comment: string): void => {
    console.log("Change comment " + comment);
}

// Method to change the relevance of a paper
let changeRelevance = (relevance: number): void => {
    console.log("Change relevance " + relevance);
}

watch(relevanceState, async (value) => {
    changeRelevance(value.data);
});

//let openPaper: OpenPaper = openPaperStore.getPaper;

let deleteTag = (): void => {
    console.log("Close");
}

</script>

<template>
    <v-navigation-drawer location="right" width="400">
        <div class="mx-8 my-3">
            <div>
                <span class="text-h5">{{ $t('detailSidebar.informations') }}</span><br>
                <span class="font-weight-bold">Karl Marx Gauß</span><br>
                <span>2022 - DAGV - 100 mal zitiert - 12 Referenzen</span>
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
                    <v-chip @click:close="deleteTag" closable :color="'#eb4034'" class="lara-chip mr-2 mb-1">Hallo</v-chip>
                    
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
                </div>
                

                <v-divider class="my-3"></v-divider>
            </div>
        </div>
    </v-navigation-drawer>
</template>