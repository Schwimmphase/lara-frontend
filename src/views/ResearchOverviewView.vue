<template>
    <v-container class="pt-8 px-16 w-75">
        <div class="d-flex d-row justify-space-between">
            <h1 class="text-h3 font-weight-bold">{{ research != null ? research.title : "" }}</h1>
            <searchbar-component id="search-bar"></searchbar-component>
        </div>
        <organizable-list :slots="slots" :organize-slots="organizeSlots" :right-button="$t('researchOverview.export')"
                          :selected-organizers="state.selectedOrganizers"
                          @click-right-button="exportResearch"
                          @organize="getSavedPapers(state.selectedOrganizers)"
                          @remove-organizer="name => removeOrganizer(name)">
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
                                        :key="index" :paper="savedPaper"
                                        @open="openPaper(savedPaper)"
                                        @delete="deletePaper(savedPaper)"
                                        @export="exportPaper(savedPaper)">
                </research-overview-card>
                <p v-if="hiddenPapers.length === 0">{{ $t("researchOverview.empty") }}</p>
            </template>

            <template v-slot:year-filter>
                <year-organizer :min="yearFilterSate.min" :max="yearFilterSate.max"
                    @year-change="(min, max) => { setOrganizer('year-filter', min + '-' + max); yearFilterSate.min = min; yearFilterSate.max = max; }">
                </year-organizer>
            </template>
        </organizable-list>
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
import OrganizableList from "@/components/basic/OrganizableList.vue";
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
import YearOrganizer from "@/components/organizers/YearOrganizer.vue";
import {Organizer} from "@/model/Organizer";
import {PaperApiHandler} from "@/api/Paper/PaperApiHandler";

let state: { savedPapers: SavedPaper[], copied: boolean, timeout: number, selectedOrganizers: Organizer[] } = reactive({
    savedPapers: [],
    copied: false,
    timeout: 3000,
    selectedOrganizers: []
});

let yearFilterSate: { min: number, max: number } = reactive({
    min: 1900,
    max: (new Date()).getFullYear()
});

// reset open paper
useOpenPaperStore().resetStore();

// Pinia store for the research
const store = useOpenResearchStore();

let research = store.getResearch;

let addedPapers = computed<SavedPaper[]>(() => {
    return state.savedPapers.filter(value => value.saveState == SaveState.added);
});

let enqueuedPapers = computed<SavedPaper[]>(() => {
    return state.savedPapers.filter(value => value.saveState == SaveState.enqueued);
});

let hiddenPapers = computed<SavedPaper[]>(() => {
    return state.savedPapers.filter(value => value.saveState == SaveState.hidden);
});

const organizeSlots: Slot[] = [{ id: "year-filter", name: "Year Filter" }];

async function getSavedPapers(organizers: Organizer[]) {
    let savedPapers = await ResearchApiHandler.getSavedPapers(research!, organizers);
    state.savedPapers = [];
    savedPapers.forEach(savedPaper => state.savedPapers.push(savedPaper));
    store.setResearchPapers(savedPapers);
}
getSavedPapers(state.selectedOrganizers);

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

function openPaper(savedPaper: SavedPaper): void {
    useOpenPaperStore().setPaper(new OpenPaper(undefined, savedPaper, true));
    router.push({ name: 'paperDetails', query: { research: savedPaper.research.id, paper: savedPaper.paper.paperId } });
}

async function deletePaper(savedPaper: SavedPaper): Promise<void> {
    await ResearchApiHandler.removePaper(savedPaper.research, savedPaper.paper);
    state.savedPapers.splice(state.savedPapers.indexOf(savedPaper), 1);
}

async function addPaper(savedPaper: SavedPaper, saveState: SaveState): Promise<void> {
    await PaperApiHandler.changeSaveState(savedPaper, saveState);
    savedPaper.saveState = saveState;
}

async function exportPaper(savedPaper: SavedPaper) {
    let bibTex = await ExportApiHandler.exportPaper(savedPaper.paper);
    await navigator.clipboard.writeText(bibTex);
    state.copied = true;
}

async function exportResearch() {
    let bibTex = await ExportApiHandler.exportResearch(research as Research, state.selectedOrganizers);
    await navigator.clipboard.writeText(bibTex);
    state.copied = true;
}

function setOrganizer(name: string, value: string) {
    if (state.selectedOrganizers.findIndex(value => value.name === name) !== -1) {
        state.selectedOrganizers.splice(state.selectedOrganizers.findIndex(value => value.name === name), 1);
    }
    state.selectedOrganizers.push(new Organizer(name, value));
}

function removeOrganizer(name: string) {
    if (state.selectedOrganizers.findIndex(value => value.name === name) !== -1) {
        state.selectedOrganizers.splice(state.selectedOrganizers.findIndex(value => value.name === name), 1);
    }
    getSavedPapers(state.selectedOrganizers);
}
</script>

<style>
#search-bar {
    width: 100%;
    max-width: 300px;
}
</style>
