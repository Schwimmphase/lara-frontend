<script setup lang="ts">

import DetailSidebarComponent from '@/components/DetailSidebarComponent.vue';
import { OpenPaper } from '../stores/model/OpenPaper';
import { useOpenPaperStore } from '../stores/openPaper';

import { useRoute } from 'vue-router';
import { reactive } from '@vue/reactivity';
import { Paper } from '../model/Paper';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';
import { stat } from 'fs/promises';

let state: {loading: boolean} = reactive({ loading: true });

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
state.loading = false;


let openPaperStore = useOpenPaperStore();
console.log(openPaperStore)
let openPaper: OpenPaper = openPaperStore.getPaper;

</script>

<template>
    <div v-if="!state.loading">
        <detail-sidebar-component></detail-sidebar-component>
        
        <div v-if="openPaper.saved && openPaper.savedPaper?.paper.pdfUrl != null">
            <iframe src="{{ openPaper.savedPaper?.paper.pdfUrl }}" frameborder="0"></iframe>



        </div>
        
        
        
        <iframe src="{{ openPaper }}" frameborder="0"></iframe>
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