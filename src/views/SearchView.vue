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

let searchState: { results: Paper[] | undefined, research: Research | undefined, query: string | undefined, loading: boolean } = reactive({
    loading: true,
    results: undefined,
    research: openResearchStore.getResearch,
    query: useRoute().query.search as string,
});

openResearchStore.$subscribe((mutation, state) => {
    searchState.research = state.openResearch;
});

let getSearchResults = async () => {
    if (searchState.query == undefined) {
        console.error("GET_SEARCH_RESULTS : No query provided on route")
        return;
    }

    // Empty query
    if (searchState.query == "") {
        searchState.loading = false;
        return;
    }

    let result = await ResearchApiHandler.searchByKeywords(searchState.query, []);
    searchState.results = result;
    searchState.loading = false;
}

getSearchResults();

</script>


<template>
    <div class="ma-4 h-100">
        <!-- Searchbar on top of the page -->
        <SearchbarComponent :input-string="searchState.query" />

        <div v-if="searchState.loading" class="h-50 ma-5 d-flex justify-center align-center">
            <v-progress-circular indeterminate size="35"></v-progress-circular>
        </div>

        <div v-if="!searchState.loading">
            <OrganizableList :slots="slots" :organize-slots="[]" :selected-organizers="[]">
                <template v-slot:search-results>
                    <UnsavedPaperCard v-for="(paper, index) in searchState.results" :key="index" :research="(searchState.research != null ? searchState.research : undefined)" :paper="paper"></UnsavedPaperCard>            
                </template>
            </OrganizableList>
        </div>
    </div>

</template>


<style scope>

@import '../assets/main.css';

</style>
