<script setup lang="ts">

import LaraButton from "../basic/LaraButton.vue";

import {Paper} from "@/model/Paper";
import {SaveState} from "@/model/SaveState";
import {Research} from "@/model/Research";
import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import router from "@/router";
import {useOpenResearchStore} from "@/stores/openResearch";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";
import type {SavedPaper} from "@/model/SavedPaper";
import {reactive} from "@vue/reactivity";


let props = defineProps({
    paper: Paper,
    research: Research,
    saved: Boolean
});

let emits = defineEmits<{
    (event: 'enqueued'): void
    (event: 'hidden'): void
}>();

let snackbarState = reactive({
    enqueued: false,
    hidden: false,
    timeout: 3000
})

const store = useOpenResearchStore();

async function createSavedPaper(state: SaveState): Promise<void> {
    console.debug(props.research, props.paper)
    if (props.research == undefined || props.paper == undefined) {
        console.error("CREATE_SAVED_PAPER : Invalid Arguments provided");
        return;
    }

    await ResearchApiHandler.savePaper(props.research, props.paper, state);

    let savedPaper: SavedPaper = await PaperApiHandler.getDetails(props.paper.paperId, props.research.id) as SavedPaper;
    store.addResearchPaper(savedPaper);

    if (state === SaveState.enqueued) {
        emits('enqueued');
        snackbarState.enqueued = true;
        snackbarState.hidden = false;
    } else if (state === SaveState.hidden) {
        emits('hidden');
        snackbarState.hidden = true;
        snackbarState.enqueued = false;
    }
}

let openPaper = (): void => {
    if (props.paper == undefined) {
        console.error("OPEN_PAPER : Invalid paper provided");
        return;
    }
    
    router.push({ name: 'paperDetails', query: { paper: props.paper.paperId }});
}

function getCardId(paper: Paper): string {
    let id = "paper-card-";
    for (let i = 0; i < Math.min(paper.title.split(" ").length, 4); i++) {
        let split = paper.title.split(" ")[i];
        id += split.substring(0, split.length > 4 ? 4 : split.length).toLowerCase() + "-";
    }
    return id.substring(0, id.length - 1);
}

</script>


<template>
    <v-card class="lara-card mt-4 w-100" id="unsaved-paper-card">
        <div class="d-flex flex-column justify-space-between h-100">
            <div>
                <v-card-title @click="openPaper" class="font-weight-bold cursor-pointer"
                              :id="getCardId(paper!) + '-title'">
                    {{ paper!.title }}
                </v-card-title>
                <v-card-subtitle>
                    {{ paper!.authors?.map(author => author.name).join(", ") }}
                </v-card-subtitle>
                <div class="mt-2 mx-4 mb-2">
                    <div class="lara-informations">
                        {{ paper!.year }} - {{ !paper!.venue ? $t('detailSidebar.unknownVenue') : paper!.venue}} -
                        {{ $t('detailSidebar.citationCount', { n: paper!.citationCount}) }} -
                        {{ $t('detailSidebar.referenceCount', {n: paper!.referenceCount}) }}
                    </div>
                    <div id="abstract-container">
                        <p id="abstract">
                            {{ !paper!.abstract ? $t('detailSidebar.abstractEmpty') : paper!.abstract }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="mx-4 mb-4 d-flex flex-row">
                <lara-button @click="openPaper" class="mt-2 mr-2 search-button" type="secondary"
                             :id="getCardId(paper!) + '-open'">
                    {{ $t('detailSidebar.open') }}
                </lara-button>
                <lara-button @click="createSavedPaper(SaveState.enqueued)" class="mt-2 mr-2 search-button"
                             type="primary" v-if="!saved" :id="getCardId(paper!) + '-enqueue'" >
                    {{ $t('detailSidebar.enqueue') }}
                </lara-button>
                <lara-button @click="createSavedPaper(SaveState.hidden)" class="mt-2 search-button" type="outline"
                             v-if="!saved" :id="getCardId(paper!) + '-hide'">
                    <v-icon>mdi-eye-off</v-icon>
                </lara-button>
            </div>
        </div>
    </v-card>

    <v-snackbar v-model="snackbarState.enqueued" :timeout="snackbarState.timeout">
        {{ $t('paperCard.snackbar.enqueued') }}
        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="snackbarState.enqueued = false" id="snackbar-enqueued-close">
                {{ $t('words.close') }}
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarState.hidden" :timeout="snackbarState.timeout" id="snackbar-hidden">
        {{ $t('paperCard.snackbar.hidden') }}
        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="snackbarState.hidden = false" id="snackbar-hidden-close">
                {{ $t('words.close') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>


<style scoped>

@import '../../assets/main.css';

.lara-informations {
    color: rgb(86, 86, 86);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 6px;
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