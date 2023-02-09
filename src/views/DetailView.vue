<script setup lang="ts">

import DetailSidebarComponent from '@/components/DetailSidebarComponent.vue';
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

const slotsReferences = [
    {id: "citations", name: i18n.global.t("words.citations")},
    {id: "references", name: i18n.global.t("words.references")},
];

const MAX_NUMBER_OF_AUTHORS = 3;

// Get the persistent saved OpenResearch
let researchStore = useOpenResearchStore();

detailState.research = researchStore.getResearch;

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

    openPaperStore.setPaper(openPaperFromAPI);
    detailState.loading = false;
}

setPaper();

async function getCitationReferences(selectedOrganizers: Organizer[]): Promise<void> {
    biggerStore.loading = true;

    biggerStore.citations = await PaperApiHandler.getCitations(detailState.openPaper!.getPaper() as Paper,
        useOpenResearchStore().getResearch!, selectedOrganizers);
    biggerStore.references = await PaperApiHandler.getReferences(detailState.openPaper!.getPaper() as Paper,
        useOpenResearchStore().getResearch!, selectedOrganizers);

    biggerStore.loading = false;
}

async function bigger(): Promise<void> {
    detailState.showBigger = !detailState.showBigger;

    if (detailState.showBigger && biggerStore.citations.length === 0 && biggerStore.references.length == 0) {
        await getCitationReferences([]);
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
        <detail-sidebar-component @bigger="bigger"></detail-sidebar-component>

        <div v-show="!detailState.showBigger" class="h-100">
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

</template>
