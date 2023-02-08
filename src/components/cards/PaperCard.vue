<script setup lang="ts">

import LaraButton from "../basic/LaraButton.vue";

import { Paper } from "@/model/Paper";
import { SaveState } from "@/model/SaveState";
import { Research } from "@/model/Research";
import { ResearchApiHandler } from "@/api/Research/ResearchApiHandler";
import router from "@/router";
import {useOpenResearchStore} from "@/stores/openResearch";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";
import {SavedPaper} from "@/model/SavedPaper";


let props = defineProps({
    paper: Paper,
    research: Research,
    saved: Boolean
});

let emits = defineEmits<{
    (event: 'enqueued'): void
}>();

const store = useOpenResearchStore();

async function createSavedPaper(state: SaveState): Promise<void> {
    console.debug(props.research, props.paper)
    if (props.research == undefined || props.paper == undefined) {
        console.error("CREATE_SAVED_PAPER : Invalid Arguments provided");
        return;
    }

    await ResearchApiHandler.savePaper(props.research, props.paper, state);

    emits('enqueued');

    let savedPaper: SavedPaper = await PaperApiHandler.getDetails(props.paper.paperId, props.research.id) as SavedPaper;
    store.addResearchPaper(savedPaper);
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
    <v-card class="lara-card mt-4 w-100" id="unsaved-paper-card">
        <div class="d-flex flex-column justify-space-between h-100">
            <div>
                <v-card-title class="font-weight-bold">{{ props.paper.title }}</v-card-title>
                <v-card-subtitle>
                    <span v-for="(author, index) in props.paper.authors" :key="index">{{ author.name }}, </span>
                </v-card-subtitle>
                <div class="mt-2 mx-4 mb-2">
                    <span class="lara-informations">
                        {{ props.paper.year }} - {{ props.paper.venue }} -
                        {{ $t('detailSidebar.citationCount', { n: props.paper.citationCount}) }} -
                        {{ $t('detailSidebar.referenceCount', {n: props.paper.referenceCount}) }}
                    </span>
                    <br>
                    <div id="abstract-container">
                        <p id="abstract">{{ props.paper.abstract }}</p>
                    </div>
                </div>
            </div>
            <div class="mx-4 mb-4 d-flex flex-row">
                <lara-button @click="createSavedPaper(SaveState.enqueued)" class="mt-2 mr-2 search-button"
                             type="primary" v-if="!saved">
                    {{ $t('detailSidebar.enqueue') }}
                </lara-button>
                <lara-button @click="openPaper" class="mt-2 mr-2 search-button" type="secondary">
                    {{ $t('detailSidebar.open') }}
                </lara-button>
                <lara-button @click="createSavedPaper(SaveState.hidden)" class="mt-2 search-button" type="outline">
                    <v-icon>mdi-eye-off</v-icon>
                </lara-button>
            </div>
        </div>
    </v-card>
</template>


<style scoped>

@import '../../assets/main.css';

.lara-informations {
    color: rgb(86, 86, 86);
}

#unsaved-paper-card {
    height: 250px;
}

#abstract-container {
    height: 75px;
    display: block !important;
}

#abstract {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    white-space: pre-wrap;
}

.search-button {
    width: 100%;
    max-width: 150px;
    min-width: 100px;
}
</style>