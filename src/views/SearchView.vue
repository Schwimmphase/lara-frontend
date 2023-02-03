<script setup lang="ts">

import { reactive } from "@vue/reactivity";

import UnsavedPaperCard from "@/components/cards/UnsavedPaperCard.vue";
import OrganizableList from "@/components/basic/OrganizableList.vue";

import SearchbarComponent from "@/components/sidebar/SearchbarComponent.vue";

import type { Paper } from "../model/Paper";
import type { Research } from "../model/Research";
import { useOpenResearchStore } from "@/stores/openResearch";
import { useRoute } from "vue-router";
import { ResearchApiHandler } from "@/api/Research/ResearchApiHandler";

import { testPaperList } from "@/model/_testResearch";
import { useOpenPaperStore } from '@/stores/openPaper';

useOpenPaperStore().resetStore();

let openResearchStore = useOpenResearchStore();

let slots = [{ id: "search-results", name: "Suchergebnisse" }];

let searchState: { results: Paper[] | undefined, research: Research | undefined, query: string | undefined } = reactive({
    results: undefined,
    research: openResearchStore.getResearch,
    query: useRoute().query.search as string,
});

openResearchStore.$subscribe((mutation, state) => {
    searchState.research = state.openResearch;
});

// TODO FETCH SEARCH RESULT
let getSearchResults = () => {
    console.log("QUERY")
    console.log(searchState.query);

    if (searchState.query == undefined) {
        console.error("GET_SEARCH_RESULTS : No query provided on route")
        return;
    }

    let result = ResearchApiHandler.searchByKeywords(searchState.query, []);
    console.debug("SEARCH RESULT");
    console.debug(result);
}

//getSearchResults();

// TODO Nur zu Testzwecken!
searchState.results = testPaperList;

</script>

<template>
    <div class="ma-4">
        <!-- Searchbar on top of the page -->
        <SearchbarComponent :input-string="searchState.query" />

        <OrganizableList :slots="slots" :organize-slots="[]" :selected-organizers="[]">
            <template v-slot:search-results>
                <UnsavedPaperCard v-for="(paper, index) in searchState.results" :key="index" :research="(searchState.research != null ? searchState.research : undefined)" :paper="paper"></UnsavedPaperCard>            
            </template>
        </OrganizableList>
    </div>



    
    

</template>

<style scope>

@import '../assets/main.css';

</style>
