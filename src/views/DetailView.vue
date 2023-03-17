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
import {useOpenResearchStore} from "@/stores/openResearch";
import type {Research} from "@/model/Research";
import TabbedView from "@/components/basic/TabbedView.vue";

// Number of the maximum of displayed authors
const MAX_NUMBER_OF_AUTHORS = 3;
const PDF_LOAD_TIMEOUT = 15_000;

// State for the page, the openPaper and a indicator to know if the page is loading
let detailState: { loading: boolean, openPaper: OpenPaper | undefined, research: Research | undefined,
                    showBigger: boolean } = reactive({
    loading: true,
    openPaper: undefined,
    research: undefined,
    showBigger: false
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
    detailState.showBigger = true;
}

async function closeTabbedView(): Promise<void> {
    detailState.showBigger = false;
}

async function toggle(): Promise<void> {
    detailState.showBigger = !detailState.showBigger;
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
        <detail-sidebar-component @toggle="toggle" @bigger="bigger" :open-paper="detailState.openPaper!" :bigger-list-shown="detailState.showBigger" id="detail-sidebar-component"></detail-sidebar-component>

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
            <span @click="closeTabbedView" class="lara-clickable lara-close-icon"><v-icon size="x-large">mdi-close</v-icon></span>
            <tabbed-view :source-paper="detailState.openPaper!.getPaper()"></tabbed-view>
        </div>
    </div>
    
    <!-- API-Call still loading -->
    <div v-else class="d-flex justify-center h-100 align-center">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <!-- Snackbar for pdf load error -->
    <v-snackbar v-model="pdfState.snackbar" :timeout="pdfState.snackbarTimeout" id="snackbar-detail-view-error-getting-pdf">
        {{ $t('detailView.errorGettingPdf') }}
        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="pdfState.snackbar = false" id="snackbar-detail-view-close-error-getting-pdf">
                {{ $t('words.close') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>

<style scoped>

.lara-close-icon {
    position: absolute;
    right: 24px;
    top: 0;
}


</style>