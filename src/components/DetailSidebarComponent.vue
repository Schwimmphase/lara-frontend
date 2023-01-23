<script setup lang="ts">

import LaraButton from './basic/LaraButton.vue';

import type { OpenPaper } from '../stores/model/OpenPaper';

import { useOpenPaperStore } from '../stores/openPaper'

import type { SavedPaper } from '../model/SavedPaper';
import type { Paper } from '../model/Paper';

// TODO nur wegen Test
import '../model/_testResearch';

//openPaperStore.setPaper();

//let openPaperStore = useOpenPaperStore();
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
                <v-textarea hide-details variant="outlined" class="mt-2 lara-field"></v-textarea>
                <lara-button class="mt-2" type="primary">{{ $t('detailSidebar.save') }}</lara-button>
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
                    <v-icon size="x-large" class="lara-star">mdi-star-outline</v-icon>
                    <v-icon size="x-large" class="lara-star">mdi-star-outline</v-icon>
                    <v-icon size="x-large" class="lara-star">mdi-star-outline</v-icon>

                    <v-icon size="x-large" class="lara-star">mdi-star</v-icon>
                    <v-icon size="x-large" class="lara-star">mdi-star</v-icon>
                    <v-icon size="x-large" class="lara-star">mdi-star</v-icon>
                </div>

                <v-divider class="my-3"></v-divider>
            </div>
        </div>
    </v-navigation-drawer>
</template>

<style scope>
</style>