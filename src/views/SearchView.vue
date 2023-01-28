<script setup lang="ts">

import { reactive } from "@vue/reactivity";

import UnsavedPaperCard from "@/components/cards/UnsavedPaperCard.vue";
import OrganizableList from "@/components/basic/OrganizableList.vue";

import type { Paper } from "../model/Paper";
import type { Research } from "../model/Research";
import { useOpenResearchStore } from "@/stores/openResearch";
import { useRoute } from "vue-router";
import { ResearchApiHandler } from "@/api/Research/ResearchApiHandler";

import { testPaperList } from "@/model/_testResearch";

let openResearchStore = useOpenResearchStore();

let searchState: { results: Paper[] | null, research: Research | null } = reactive({
    results: null,
    research: openResearchStore.getResearch,
});

console.log("RESEARCH")
console.log(searchState.research);

openResearchStore.$subscribe((mutation, state) => {
    console.log("Modified")
    searchState.research = state.openResearch;
});

// TODO FETCH SEARCH RESULT
let getSearchResults = () => {
    let route = useRoute();

    let searchQuery: string = route.query.search as string;

    console.log("QUERY")
    console.log(searchQuery);

    let result = ResearchApiHandler.searchByKeywords(searchQuery, []);
    console.debug("SEARCH RESULT");
    console.debug(result);
}

//getSearchResults();

searchState.results = testPaperList;

</script>

<template>
    
    <UnsavedPaperCard v-for="(paper, index) in searchState.results" :key="index" :paper="paper"></UnsavedPaperCard>


    <span>SearchView</span>
    <router-link :to="{ name: 'paperDetails', query: {paper: 'id1234567890'}}">PAPER TEST</router-link>
    <div class="ma-5">
        
    </div>

</template>