<script setup lang="ts">

import DetailSidebarComponent from '@/components/DetailSidebarComponent.vue';
import { OpenPaper } from '../stores/model/OpenPaper';
import { useOpenPaperStore } from '../stores/openPaper';

import { useRoute } from 'vue-router';
import { reactive } from '@vue/reactivity';
import { Paper } from '../model/Paper';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';
import { stat } from 'fs/promises';

let detailState: {loading: boolean, openPaper: OpenPaper | null } = reactive({
    loading: true,
    openPaper: null
});

let route = useRoute();

let setPaper = async () => {
    console.log(route);

    let researchId = route.query.research;
    let paperId = route.query.paper;

    // TODO pass researchId when its implemented
    let response = await PaperApiHandler.getDetailsOfPaper(paperId as string) as Paper;

    let openPaperFromAPI: OpenPaper = new OpenPaper(response, null, false);

    console.log(openPaperFromAPI)

    openPaperStore.setPaper(openPaperFromAPI);
}

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
    <div v-if="!detailState.loading" class="w-100 h-100">
        <detail-sidebar-component></detail-sidebar-component>
        
        <div class="w-100 h-100" v-if="!detailState.openPaper?.saved && detailState.openPaper?.paper?.pdfUrl != null">
            <iframe :src="detailState.openPaper.paper.pdfUrl" class="w-100 h-100" frameborder="0"></iframe>
        </div>

        <div v-if="!detailState.openPaper?.saved && detailState.openPaper?.paper?.pdfUrl != null">



        </div>
    </div>
    
    <div v-else class="d-flex justify-center h-100 align-center">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>


    

    

    


   
    <!--
    <div v-if="openPaper.saved">
        <iframe class="w-100 h-100" src="{{ openPaper.paper.pdfUrl }}" frameborder="0"></iframe>
    </div>

    <div v-else>
        <iframe class="w-100 h-100" src="{{ openPaper.pdfUrl }}" frameborder="0"></iframe>
    </div>

    -->
</template>