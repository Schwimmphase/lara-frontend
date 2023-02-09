<script setup lang="ts">

import {reactive} from "@vue/reactivity";

import PaperCard from "@/components/cards/PaperCard.vue";

import SearchbarComponent from "@/components/sidebar/SearchbarComponent.vue";

import type {Paper} from "@/model/Paper";
import type {Research} from "@/model/Research";
import {useOpenResearchStore} from "@/stores/openResearch";
import {useRoute} from "vue-router";
import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";

import {useOpenPaperStore} from '@/stores/openPaper';
import type {SavedPaper} from "@/model/SavedPaper";
import PaperOrganizableList from "@/components/basic/PaperOrganizableList.vue";
import {Organizer} from "@/model/Organizer";

useOpenPaperStore().resetStore();

let openResearchStore = useOpenResearchStore();

let slots = [{ id: "search-results", name: "Suchergebnisse" }];

let searchState: { results: Paper[], research: Research | undefined, query: string | undefined, loading: boolean } = reactive({
    loading: true,
    results: [],
    research: openResearchStore.getResearch,
    query: useRoute().query.search as string,
});

openResearchStore.$subscribe((mutation, state) => {
    searchState.research = state.openResearch;
});

async function getSearchResults(selectedOrganizers: Organizer[]): Promise<void> {
    searchState.loading = true;

    if (searchState.query == undefined) {
        console.error("GET_SEARCH_RESULTS : No query provided on route")
        return;
    }

    // Empty query
    if (searchState.query == "") {
        searchState.loading = false;
        return;
    }

    searchState.results = await ResearchApiHandler.searchByKeywords(searchState.query, selectedOrganizers);

    searchState.loading = false;
}

getSearchResults([]);

function isSaved(paper: Paper): boolean {
    let savedPapers: SavedPaper[] = openResearchStore.getResearchPapers;
    return savedPapers.filter(savedPaper => savedPaper.paper.paperId === paper.paperId).length > 0;
}

</script>


<template>
    <div class="mt-8 mx-16 h-100">
        <!-- Searchbar on top of the page -->
        <SearchbarComponent :input-string="searchState.query" />

        <div v-if="searchState.loading" class="h-50 ma-5 d-flex justify-center align-center">
            <v-progress-circular indeterminate size="35"></v-progress-circular>
        </div>

        <div v-show="!searchState.loading">
            <paper-organizable-list :slots="slots" :export-enabled="false"
                                    @organize="organizers => getSearchResults(organizers)">
                <template v-slot:search-results>
                    <paper-card v-for="(paper, index) in searchState.results" :key="index"
                                :research="(searchState.research != null ? searchState.research : undefined)"
                                :paper="paper" :saved="isSaved(paper)">
                    </paper-card>
                </template>
            </paper-organizable-list>
        </div>
    </div>

</template>


<style>

</style>
