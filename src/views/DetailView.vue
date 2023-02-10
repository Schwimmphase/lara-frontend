<script setup lang="ts">

import DetailSidebarComponent from '@/components/detailSidebar/DetailSidebarComponent.vue';
import { OpenPaper } from '@/stores/model/OpenPaper';

import type { Paper } from '@/model/Paper';
import type { SavedPaper } from '@/model/SavedPaper';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';

import { useRoute } from 'vue-router';
import { reactive } from '@vue/reactivity';
import type { Author } from '@/model/Author';
import {useOpenResearchStore} from "@/stores/openResearch";
import type {Research} from "@/model/Research";


// State for the page, the openPaper and a indicator to know if the page is loading
let detailState: {loading: boolean, openPaper: OpenPaper | undefined } = reactive({
    loading: true,
    openPaper: undefined
});

const MAX_NUMBER_OF_AUTHORS = 3;

// Get the persistent saved OpenResearch
let researchStore = useOpenResearchStore();

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

    detailState.openPaper = openPaperFromAPI;
    detailState.loading = false;
}

setPaper();

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

</script>


<template>
    <!-- Render if the API Call is complete -->
    <div v-if="!detailState.loading" class="w-100 h-100">
        <detail-sidebar-component :open-paper="detailState.openPaper!"></detail-sidebar-component>

        <!-- Paper is saved and pdf is available -->
        <div v-if="(detailState.openPaper?.saved) && (detailState.openPaper?.savedPaper?.paper.pdfUrl != null)" class="w-100 h-100">
            <iframe :src="detailState.openPaper.savedPaper?.paper.pdfUrl + '#zoom=page-width'" class="w-100 h-100" frameborder="0"></iframe>
        </div>

        <!-- Paper is not saved but pdf is available -->
        <div v-else-if="!(detailState.openPaper?.saved) && (detailState.openPaper?.paper?.pdfUrl != null)" class="w-100 h-100">
            <iframe :src="detailState.openPaper.paper?.pdfUrl + '#zoom=page-width'" class="w-100 h-100" frameborder="0"></iframe>
        </div>

        <!-- Paper is saved but pdf is not available -->
        <div v-else-if="(detailState.openPaper?.saved) && (detailState.openPaper?.savedPaper?.paper.pdfUrl == null)" class="w-100 h-100">
            <div class="ma-10">
                <!-- Display the abstract of the paper -->
                <span class="text-h4 font-weight-bold">{{ detailState.openPaper?.savedPaper?.paper.title }}</span><br>
                <div class="mt-5">
                    <span class="font-weight-bold text-h5">{{ $t('detailView.abstract') }}</span><br>
                    <span>{{ detailState.openPaper?.savedPaper?.paper.abstract }}</span>
                </div>
                <v-divider class="mt-5"></v-divider>
                <!-- Display additional information on the paper -->
                <div class="mt-5">
                    <span class="text-h4 font-weight-bold">{{ $t('detailSidebar.information') }}</span><br>
                    <div class="mb-2 text-h6">
                        <span class="font-weight-bold text-h6">{{ getAuthorsString(detailState.openPaper?.savedPaper?.paper.authors) }}</span>
                    </div>
                    <span>{{ $t('detailView.year_venue_timesCited_timesReferenced', {year: detailState.openPaper?.savedPaper?.paper.year,
                        venue: detailState.openPaper?.savedPaper?.paper.venue, timesCited: detailState.openPaper?.savedPaper?.paper.citationCount,
                        timesReferenced: detailState.openPaper?.savedPaper?.paper.referenceCount}) }}</span>
                </div>
                <v-divider class="my-3"></v-divider>
            </div>
        </div>

        <!-- Paper is not saved and pdf is not available -->
        <div v-else-if="!(detailState.openPaper?.saved) && (detailState.openPaper?.paper?.pdfUrl == null)" class="w-100 h-100">
            <div class="ma-10">
                <!-- Display the abstract of the paper -->
                <span class="text-h4 font-weight-bold">{{ detailState.openPaper?.paper?.title }}</span><br>
                <div class="mt-5">
                    <span class="text-h5 font-weight-bold">{{ $t('detailView.abstract') }}</span><br>
                    <span>{{ detailState.openPaper?.paper?.abstract }}</span>
                </div>
                <v-divider class="mt-5"></v-divider>
                <!-- Display additional information on the paper -->
                <div class="mt-5">
                    <span class="text-h4 font-weight-bold">{{ $t('detailSidebar.information') }}</span><br>
                    <div class="mb-2 text-h6">
                        <span class="font-weight-bold text-h6">{{ getAuthorsString(detailState.openPaper?.paper?.authors) }}</span>
                    </div>
                    <span>{{ $t('detailView.year_venue_timesCited_timesReferenced', {year: detailState.openPaper?.paper?.year, venue: detailState.openPaper?.paper?.venue, timesCited: detailState.openPaper?.paper?.citationCount, timesReferenced: detailState.openPaper?.paper?.referenceCount}) }}</span>
                </div>
                <v-divider class="my-3"></v-divider>
            </div>
        </div>
        
        <div v-else>{{ $t('detailView.errorGettingPdf') }}</div>
    </div>
    
    <!-- API-Call still loading -->
    <div v-else class="d-flex justify-center h-100 align-center">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>

</template>
