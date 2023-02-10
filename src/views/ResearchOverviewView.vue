<template>
    <v-container class="pt-8 px-16 w-75">
        <div class="d-flex d-row justify-space-between">
            <h1 class="text-h3 font-weight-bold">{{ research != null ? research.title : "" }}</h1>
            <searchbar-component id="search-bar"></searchbar-component>
        </div>
        <paper-organizable-list :slots="slots" @organize="selected => { getSavedPapers(selected); updateResearchPaperStore(); }"
                                @export="selected => exportResearch(selected)"
                                :export-enabled="true">
            <template v-slot:added>
                <research-overview-card v-for="(savedPaper, index) in addedPapers"
                                        :key="index" :paper="savedPaper"
                                        @open="openPaper(savedPaper)"
                                        @delete="deletePaper(savedPaper)"
                                        @export="exportPaper(savedPaper)">
                </research-overview-card>
                <p v-if="addedPapers.length === 0">{{ $t("researchOverview.empty") }}</p>
            </template>
            <template v-slot:enqueued>
                <research-overview-card v-for="(savedPaper, index) in enqueuedPapers"
                                        :key="index"  :paper="savedPaper" :add-button="true"
                                        @open="openPaper(savedPaper)"
                                        @delete="deletePaper(savedPaper)"
                                        @add="addPaper(savedPaper, SaveState.added)"
                                        @export="exportPaper(savedPaper)">
                </research-overview-card>
                <p v-if="enqueuedPapers.length === 0">{{ $t("researchOverview.empty") }}</p>
            </template>
            <template v-slot:hidden>
                <research-overview-card v-for="(savedPaper, index) in hiddenPapers"
                                        :key="index" :paper="savedPaper" :add-button="true"
                                        @open="openPaper(savedPaper)"
                                        @delete="deletePaper(savedPaper)"
                                        @add="addPaper(savedPaper, SaveState.added)"
                                        @export="exportPaper(savedPaper)">
                </research-overview-card>
                <p v-if="hiddenPapers.length === 0">{{ $t("researchOverview.empty") }}</p>
            </template>
        </paper-organizable-list>
    </v-container>

    <v-snackbar v-model="state.copied" :timeout="state.timeout">
        {{ $t('researchOverview.copied') }}
        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="state.copied = false">
                {{ $t('researchOverview.close') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>


<script setup lang="ts">

import type {Slot} from "@/components/basic/OrganizableList.vue";
import type {SavedPaper} from "@/model/SavedPaper";
import {useOpenResearchStore} from "@/stores/openResearch.js";
import ResearchOverviewCard from "@/components/cards/ResearchOverviewCard.vue";
import router from "../router";
import {useOpenPaperStore} from "@/stores/openPaper";
import {OpenPaper} from "@/stores/model/OpenPaper";
import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";
import {computed, reactive} from "vue";
import {SaveState} from "@/model/SaveState";
import {i18n} from "@/internationalization/i18n";
import SearchbarComponent from "@/components/sidebar/SearchbarComponent.vue";
import {ExportApiHandler} from "@/api/Export/ExportApiHandler";
import type {Research} from "@/model/Research";
import type {Organizer} from "@/model/Organizer";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";
import PaperOrganizableList from "@/components/basic/PaperOrganizableList.vue";

let state: { savedPapers: SavedPaper[], copied: boolean, timeout: number, loading: boolean } = reactive({
    savedPapers: [],
    copied: false,
    timeout: 3000,
    loading: true
});

// reset open paper, because on the ResearchOverview there is no open paper
useOpenPaperStore().resetStore();

// Pinia store for the research
const store = useOpenResearchStore();

let research = store.getResearch;
document.title = research!.title + " - lara";

let addedPapers = computed<SavedPaper[]>(() => {
    return state.savedPapers.filter(value => value.saveState == SaveState.added);
});

let enqueuedPapers = computed<SavedPaper[]>(() => {
    return state.savedPapers.filter(value => value.saveState == SaveState.enqueued);
});

let hiddenPapers = computed<SavedPaper[]>(() => {
    return state.savedPapers.filter(value => value.saveState == SaveState.hidden);
});

let enqueued = computed(() => {
    return i18n.global.t("researchOverview.enqueued");
});

let hidden = computed(() => {
    return i18n.global.t("researchOverview.hidden");
});

let slots: Slot[] = [
    { id: "added" },
    { id: "enqueued", name: enqueued.value }, // TODO: currently does not auto update
    { id: "hidden", name: hidden.value } // TODO: currently does not auto update
];

const organizeSlots: Slot[] = [{ id: "year-filter", name: "Year Filter" }];

async function getSavedPapers(organizers: Organizer[]) {
    state.loading = true;

    let savedPapers = await ResearchApiHandler.getSavedPapers(research!, organizers);
    state.savedPapers = [];
    savedPapers.forEach(savedPaper => state.savedPapers.push(savedPaper));

    state.loading = false;
}

async function exportResearch(selectedOrganizers: Organizer[]) {
    let bibTex = await ExportApiHandler.exportResearch(research as Research, selectedOrganizers);
    await navigator.clipboard.writeText(bibTex);
    state.copied = true;
}

async function exportPaper(savedPaper: SavedPaper) {
    let bibTex = await ExportApiHandler.exportPaper(savedPaper.paper);
    await navigator.clipboard.writeText(bibTex);
    state.copied = true;
}

function openPaper(savedPaper: SavedPaper): void {
    useOpenPaperStore().setPaper(new OpenPaper(undefined, savedPaper, true));
    router.push({ name: 'paperDetails', query: { paper: savedPaper.paper.paperId } });
}

async function addPaper(savedPaper: SavedPaper, saveState: SaveState): Promise<void> {
    await PaperApiHandler.changeSaveState(savedPaper, saveState);
    savedPaper.saveState = saveState;
}

async function deletePaper(savedPaper: SavedPaper): Promise<void> {
    await ResearchApiHandler.removePaper(savedPaper.research, savedPaper.paper);
    state.savedPapers.splice(state.savedPapers.indexOf(savedPaper), 1);
    store.removeResearchPaper(savedPaper);
}

// Helper method to update research store
async function updateResearchPaperStore() {
    let savedPapers = await ResearchApiHandler.getSavedPapers(research!, []);
    store.setResearchPapers(savedPapers);
}

getSavedPapers([]);

updateResearchPaperStore();

</script>


<style>

#search-bar {
    width: 100%;
    max-width: 300px;
}

</style>
