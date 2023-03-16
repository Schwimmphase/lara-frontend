<script setup lang="ts">

import DetailSidebarComponent from '@/components/detailSidebar/DetailSidebarComponent.vue';
import {OpenPaper} from '@/stores/model/OpenPaper';
import {useOpenPaperStore} from '@/stores/openPaper';

import type {Paper} from '@/model/Paper';
import type {SavedPaper} from '@/model/SavedPaper';
import {PaperApiHandler} from '@/api/Paper/PaperApiHandler';

import {useRoute} from 'vue-router';
import {reactive} from '@vue/reactivity';
import type {Author} from '@/model/Author';
import {i18n} from "@/internationalization/i18n";
import PaperCard from "@/components/cards/PaperCard.vue";
import PaperOrganizableList from "@/components/basic/PaperOrganizableList.vue";
import {useOpenResearchStore} from "@/stores/openResearch";
import type {Research} from "@/model/Research";
import type {Organizer} from "@/model/Organizer";

const slotsReferences = [
    {id: "citations", name: "citations", key: "citatoins" },
    {id: "references", name: "references", key: "references" },
];

// Number of the maximum of displayed authors
const MAX_NUMBER_OF_AUTHORS = 3;
const PDF_LOAD_TIMEOUT = 15_000;

// State for the page, the openPaper and a indicator to know if the page is loading
let detailState: {loading: boolean, openPaper: OpenPaper | undefined, research: Research | undefined, showBigger: boolean } = reactive({
    loading: true,
    openPaper: undefined,
    research: undefined,
    showBigger: false
});

let biggerStore: {citations: Paper[], references: Paper[], loading: boolean} = reactive({
    citations: [],
    references: [],
    loading: true
});

// Method to fetch the correct paper from the API and save it in the open paper store
async function setPaper(): Promise<void> {
    // Access the route to get the ids for the paper from the query
    let route = useRoute();
    let paperId = route.query.paper as string;

    let isSavedPaper = researchStore.getResearchPapers
        .filter(savedPaper => savedPaper.paper.paperId === paperId).length > 0;

    let openPaperFromAPI;
    if (isSavedPaper) {
        let research = researchStore.getResearch as Research;

        let savedPaper = await PaperApiHandler.getDetails(paperId, research.id) as SavedPaper;
        openPaperFromAPI = new OpenPaper(undefined, savedPaper, true);
    } else {
        let paper = await PaperApiHandler.getDetails(paperId, null) as Paper;
        openPaperFromAPI = new OpenPaper(paper, undefined, false);
    }

    document.title = openPaperFromAPI.getPaper()!.title + " - lara";

    openPaperStore.setPaper(openPaperFromAPI);
    detailState.loading = false;
}

async function bigger(): Promise<void> {
    detailState.showBigger = !detailState.showBigger;

    if (detailState.showBigger && biggerStore.citations.length === 0 && biggerStore.references.length == 0) {
        await getCitationReferences([]);
    }
}

async function getCitationReferences(selectedOrganizers: Organizer[]): Promise<void> {
    biggerStore.loading = true;

    biggerStore.citations = await PaperApiHandler.getCitations(detailState.openPaper!.getPaper() as Paper, selectedOrganizers);
    biggerStore.references = await PaperApiHandler.getReferences(detailState.openPaper!.getPaper() as Paper, selectedOrganizers);

    biggerStore.loading = false;
}

// Helper Methods
// Method to format the authors of the open paper
function getAuthorsString(authors: Author[] | undefined) {
    if (authors == undefined) {
        return "";
    } else if (authors.length > MAX_NUMBER_OF_AUTHORS) {
        return authors.slice(0, MAX_NUMBER_OF_AUTHORS).map(author => author.name).join(", ") + " et al.";
    } else {
        return authors.map(author => author.name).join(", ");
    }
}

function isSaved(paper: Paper): boolean {
    let savedPapers: SavedPaper[] = researchStore.researchPapers;
    return savedPapers.filter(savedPaper => savedPaper.paper.paperId === paper.paperId).length > 0;
}

let openPaperStore = useOpenPaperStore();

detailState.openPaper = openPaperStore.paper;

openPaperStore.$subscribe((mutation, state) => {
    // When a change in the paper is detected, update the state
    detailState.openPaper = state.paper;
})

// Get the persistent saved OpenResearch
let researchStore = useOpenResearchStore();
// Set the research
detailState.research = researchStore.getResearch;

setPaper();

// Pdf load handling

let pdfState: {error: boolean, snackbar: boolean, snackbarTimeout: number} = reactive({
    error: false,
    snackbar: false,
    snackbarTimeout: 5000
});

function onPdfError() {
    pdfState.error = true;
    pdfState.snackbar = true;
}

</script>


<template>
    <!-- Render if the API Call is complete -->
    <div v-if="!detailState.loading" class="w-100 h-100">
        <detail-sidebar-component @bigger="bigger" :open-paper="detailState.openPaper!"></detail-sidebar-component>

        <div v-show="!detailState.showBigger" class="h-100">
            <!-- Paper pdf is available -->
            <div v-if="detailState.openPaper?.getPaper()?.pdfUrl != null && !pdfState.error" class="w-100 h-100">
                <object type="application/pdf" :data="detailState.openPaper!.getPaper()!.pdfUrl + '#zoom=page-width'"
                        class="w-100 h-100" @error="onPdfError">
                </object>
            </div>

            <!-- Paper pdf is not available or error while loading pdf -->
            <div v-else class="w-100 h-100">
                <div class="ma-10">
                    <!-- Display the abstract of the paper -->
                    <span class="text-h4 font-weight-bold">{{ detailState.openPaper?.getPaper()?.title }}</span><br>
                    <div class="mt-5">
                        <span class="font-weight-bold text-h5">{{ $t('detailView.abstract') }}</span><br>
                        <span>
                            {{ !detailState.openPaper?.getPaper()?.abstract ?
                            $t('detailSidebar.abstractEmpty') : detailState.openPaper?.getPaper()?.abstract }}
                        </span>
                    </div>
                    <v-divider class="mt-5"></v-divider>
                    <!-- Display additional information on the paper -->
                    <div class="mt-5">
                        <span class="text-h4 font-weight-bold">{{ $t('detailSidebar.information') }}</span><br>
                        <div class="mb-2 text-h6">
                            <span class="font-weight-bold text-h6">{{ getAuthorsString(detailState.openPaper?.getPaper()?.authors) }}</span>
                        </div>
                        <span>
                            {{ $t('detailView.year_venue_timesCited_timesReferenced', {
                            year: detailState.openPaper?.getPaper()?.year,
                            venue: !detailState.openPaper?.getPaper()?.venue ?
                                $t('detailSidebar.unknownVenue') : detailState.openPaper?.getPaper()?.venue,
                            timesCited: detailState.openPaper?.getPaper()?.citationCount,
                            timesReferenced: detailState.openPaper?.getPaper()?.referenceCount}) }}
                        </span>
                    </div>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>
        </div>

        <!-- bigger view of button is pressed, replaces pdf viewer and information -->
        <div v-show="detailState.showBigger" class="h-100">
            <div class="mx-16">
                <paper-organizable-list :slots="slotsReferences" :export-enabled="false"
                                        @organize="organizers => getCitationReferences(organizers)">
                    <template v-slot:citations>
                        <div v-if="biggerStore.loading" class="h-50 w-100 ma-5 d-flex justify-center align-center">
                            <v-progress-circular indeterminate size="35"></v-progress-circular>
                        </div>

                        <paper-card v-for="(paper, index) in biggerStore.citations" :key="index" :paper="paper" v-else
                                    :research="detailState.research" :saved="isSaved(paper)"/>
                        <span v-if="biggerStore.citations.length === 0 && !biggerStore.loading">
                            {{ $t('detailView.biggerListEmpty') }}
                        </span>
                    </template>
                    <template v-slot:references>
                        <div v-if="biggerStore.loading" class="h-50 w-100 ma-5 d-flex justify-center align-center">
                            <v-progress-circular indeterminate size="35"></v-progress-circular>
                        </div>

                        <paper-card v-for="(paper, index) in biggerStore.references" :key="index" :paper="paper" v-else
                                    :research="detailState.research" :saved="isSaved(paper)" />
                        <span v-if="biggerStore.references.length === 0 && !biggerStore.loading">
                            {{ $t('detailView.biggerListEmpty') }}
                        </span>
                    </template>
                </paper-organizable-list>
            </div>
        </div>
    </div>
    
    <!-- API-Call still loading -->
    <div v-else class="d-flex justify-center h-100 align-center">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <!-- Snackbar for pdf load error -->
    <v-snackbar v-model="pdfState.snackbar" :timeout="pdfState.snackbarTimeout">
        {{ $t('detailView.errorGettingPdf') }}
        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="pdfState.snackbar = false">
                {{ $t('words.close') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>
