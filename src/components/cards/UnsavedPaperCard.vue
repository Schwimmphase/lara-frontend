<script setup lang="ts">

import LaraButton from "../basic/LaraButton.vue";

import { Paper } from "../../model/Paper";
import { SaveState } from "@/model/SaveState";
import { Research } from "../../model/Research";
import { ResearchApiHandler } from "@/api/Research/ResearchApiHandler";
import router from "@/router";


let props = defineProps({
    paper: Paper,
    research: Research
});

let createSavedPaper = (state: SaveState): void => {
    if (props.research == undefined || props.paper == undefined) {
        console.error("CREATE_SAVED_PAPER : Invalid Arguments provided");
        return;
    }

    console.debug("Create save paper");
    console.debug(props.paper.title);
    console.debug(props.research.title);
    ResearchApiHandler.savePaper(props.research, props.paper, state);
}

let openPaper = (): void => {
    if (props.paper == undefined) {
        console.error("OPEN_PAPER : Invalid paper provided");
        return;
    }
    
    router.push({ name: 'paperDetails', query: { paper: props.paper.paperId }});
}

</script>


<template>
    <v-card class="lara-card mt-4">
        <v-card-title class="font-weight-bold">{{ paper?.title }}</v-card-title>
        <v-card-subtitle><span v-for="(author, index) in paper?.author" :key="index">{{ author.name }}</span></v-card-subtitle>
        <div class="mt-2 mx-4 mb-2">
            <span class="lara-informations">{{ paper?.year }} - {{ paper?.venue }} - {{ $t('detailSidebar.citationCount', { n: paper?.citationCount}) }} - {{ $t('detailSidebar.referenceCount', {n: paper?.referenceCount}) }}</span><br>
            <span>{{ paper?.abstract }}</span>
        </div>
        <div class="mx-4 mb-2 d-flex flex-row">
            <lara-button @click="createSavedPaper(SaveState.enqueued)" class="mt-2 mr-2 w-25" type="primary">{{ $t('detailSidebar.enqueue') }}</lara-button>
            <lara-button @click="openPaper" class="mt-2 mr-2 w-25" type="secondary">{{ $t('detailSidebar.open') }}</lara-button>
            <lara-button @click="createSavedPaper(SaveState.hidden)" class="mt-2 w-25" type="outline">
                <v-icon>mdi-eye-off</v-icon>
            </lara-button>
        </div>
    </v-card>
</template>


<style scoped>

@import '../../assets/main.css';

.lara-informations {
    color: rgb(86, 86, 86);
}


</style>