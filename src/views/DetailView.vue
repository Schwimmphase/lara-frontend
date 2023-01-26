<script setup lang="ts">

import DetailSidebarComponent from '@/components/DetailSidebarComponent.vue';
import { OpenPaper } from '../stores/model/OpenPaper';
import { useOpenPaperStore } from '../stores/openPaper';

import { useRoute } from 'vue-router';
import { reactive } from '@vue/reactivity';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';

let state: {loading: boolean} = reactive({ loading: true });

let route = useRoute();

let setPaper = () => {
    console.log(route);

    let researchId = route.query.research;
    let paperId = route.query.paper;

    console.log("IDS " + researchId + " : " + paperId);

    // TODO Get Paper from API
    
}

setPaper();


let openPaperStore = useOpenPaperStore();
console.log(openPaperStore)
let openPaper: OpenPaper = openPaperStore.getPaper;

</script>

<template>
    <div v-if="!state.loading">
        <detail-sidebar-component></detail-sidebar-component>
    
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