<script setup lang="ts">

import DetailSidebarComponent from '@/components/DetailSidebarComponent.vue';
import { OpenPaper } from '../stores/model/OpenPaper';
import { useOpenPaperStore } from '../stores/openPaper';

import type { Paper } from '../model/Paper';
import { Author } from '../model/Author';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';

import { useRoute } from 'vue-router';
import { reactive } from '@vue/reactivity';
import { SavedPaper } from '../model/SavedPaper';

// State for the page, the openPaper and a indicator to know, if the page is loading
let detailState: {loading: boolean, openPaper: OpenPaper | null } = reactive({
    loading: true,
    openPaper: null
});

// Access the route to get the the ids for the paper from the query
let route = useRoute();

// Method to fetch the correct paper from the API and safe it to the store
let setPaper = async () => {
    console.log(route);

    let researchId = route.query.research;
    let paperId = route.query.paper;

    let openPaperFromAPI: OpenPaper;
    // TODO pass researchId when its implemented
    if (researchId == undefined) {
        let response = await PaperApiHandler.getDetailsOfPaper(paperId as string) as Paper;
        openPaperFromAPI = new OpenPaper(response, null, false);
    } else {
        let response = await PaperApiHandler.getDetailsOfPaper(paperId as string, researchId as string) as SavedPaper;
        openPaperFromAPI = new OpenPaper(null, response, false);
    }    

    // TODO AUTOREN MÜSSEN NOCH GEPARSED WERDEN

    openPaperStore.setPaper(openPaperFromAPI);

}

// Set the paper from the query
setPaper();

detailState.loading = false;

let openPaperStore = useOpenPaperStore();

detailState.openPaper = openPaperStore.getPaper;

openPaperStore.$subscribe((mutation, state) => {
    // When a change in the paper is detected, update the state
    detailState.openPaper = state.paper;
})

</script>

<template>
    <!-- Render if the API Call is complete -->
    <div v-if="!detailState.loading" class="w-100 h-100">
        <detail-sidebar-component></detail-sidebar-component>

        <!-- Paper is not saved and pdf is not available -->
        <div class="w-100 h-100" v-if="!detailState.openPaper?.saved && !detailState.openPaper?.paper?.pdfUrl == null">
            <!-- Display the abstract of the paper and some additional informations -->
            <div class="ma-10">
                <span class="text-h2 font-weight-bold">{{ detailState.openPaper?.paper?.title }}</span><br>
                <div class="mt-5">
                    <span class="text-h4 font-weight-bold">Abstract</span><br>
                    <span class="text-h5">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                    </span>
                    <span class="text-h5">{{ detailState.openPaper?.paper?.abstract }}</span>
                </div>
                <v-divider class="mt-5"></v-divider>

                <div class="mt-5">
                    <span class="text-h4 font-weight-bold">{{ $t('detailSidebar.informations') }}</span><br>
                    <div class="mb-2 text-h4">
                        <!-- TODO Sobald AUTHORS wieder rausnehmen -->
                        <span v-for="(author, index) in detailState.openPaper?.paper?.author" :key="index" class="font-weight-bold text-h5">{{ author.name }}</span>
                    </div>
                    <span class="text-h5">{{ detailState.openPaper?.paper?.year }} - {{ detailState.openPaper?.paper?.venue }} - {{ detailState.openPaper?.paper?.citationCount }} mal zitiert - {{ detailState.openPaper?.paper?.referenceCount }} Referenzen</span>
                    <v-divider class="my-3"></v-divider>
                </div>
                
            </div>
        </div>

        <!-- Paper is not saved but pdf is not available -->
        <div class="w-100 h-100" v-if="detailState.openPaper?.saved && !detailState.openPaper?.savedPaper?.paper.pdfUrl == null">
            <!-- Display the abstract of the paper and some additional informations -->
            <div class="ma-10">
                <span class="text-h2 font-weight-bold">{{ detailState.openPaper?.paper?.title }}</span><br>
                <div class="mt-5">
                    <span class="text-h4 font-weight-bold">Abstract</span><br>
                    <span class="text-h5">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                    </span>
                    <span class="text-h5">{{ detailState.openPaper?.paper?.abstract }}</span>
                </div>
                <v-divider class="mt-5"></v-divider>

                <div class="mt-5">
                    <span class="text-h4 font-weight-bold">{{ $t('detailSidebar.informations') }}</span><br>
                    <div class="mb-2 text-h4">
                        <!-- TODO Sobald AUTHORS wieder rausnehmen -->
                        <span v-for="(author, index) in detailState.openPaper?.paper?.author" :key="index" class="font-weight-bold text-h5">{{ author.name }}</span>
                    </div>
                    <span class="text-h5">{{ detailState.openPaper?.paper?.year }} - {{ detailState.openPaper?.paper?.venue }} - {{ detailState.openPaper?.paper?.citationCount }} mal zitiert - {{ detailState.openPaper?.paper?.referenceCount }} Referenzen</span>
                    <v-divider class="my-3"></v-divider>
                </div>
                
            </div>
        </div>
        
        <!-- Paper is saved and pdf is available -->
        <div class="w-100 h-100" v-if="detailState.openPaper?.saved && detailState.openPaper?.paper?.pdfUrl != null">
            <iframe :src="detailState.openPaper.savedPaper?.paper.pdfUrl" class="w-100 h-100" frameborder="0"></iframe>
        </div>

        <!-- Paper is not saved but pdf is available -->
        <div class="w-100 h-100" v-if="!detailState.openPaper?.saved && detailState.openPaper?.paper?.pdfUrl != null">
            <iframe :src="detailState.openPaper.paper?.pdfUrl" class="w-100 h-100" frameborder="0"></iframe>
        </div>

        <div v-else>Lieder ist ein Fehler aufgetreten!</div>
    </div>
    
    <!-- API Call still loading -->
    <div v-else class="d-flex justify-center h-100 align-center">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>
</template>