<script setup lang="ts">

import {reactive} from "@vue/reactivity";
import {useRoute} from "vue-router";

import type {Paper} from "@/model/Paper";
import type {Research} from "@/model/Research";
import {useOpenResearchStore} from "@/stores/openResearch";
import {ResearchApiHandler} from "@/api/Research/ResearchApiHandler";

import {useOpenPaperStore} from '@/stores/openPaper';
import type {SavedPaper} from "@/model/SavedPaper";
import PaperOrganizableList from "@/components/basic/PaperOrganizableList.vue";
import SearchbarComponent from "@/components/sidebar/SearchbarComponent.vue";
import LaraButton from "@/components/basic/LaraButton.vue";
import PaperCard from "@/components/cards/PaperCard.vue";
import type {Organizer} from "@/model/Organizer";

let openResearchStore = useOpenResearchStore();
let slots = [{ id: "search-results", name: "Suchergebnisse", key: "searchResults" }];

let searchState: { results: Paper[], research: Research | undefined, query: string | undefined, loading: boolean } = reactive({
    loading: true,
    results: [],
    research: openResearchStore.getResearch,
    query: useRoute().query.search as string,
});

async function getSearchResults(selectedOrganizers: Organizer[]): Promise<void> {
    if (searchState.query == undefined) {
        searchState.loading = false;    
        return;
    }

    searchState.loading = true;

    document.title = searchState.query + " ‐ lara";

    // Empty query
    if (searchState.query == "") {
        searchState.loading = false;
        document.title = "lara";
        return;
    }

    searchState.results = await ResearchApiHandler.searchByKeywords(searchState.query, selectedOrganizers);

    searchState.loading = false;
}

// Helper methods
function isSaved(paper: Paper): boolean {
    let savedPapers: SavedPaper[] = openResearchStore.getResearchPapers;
    return savedPapers.filter(savedPaper => savedPaper.paper.paperId === paper.paperId).length > 0;
}

openResearchStore.$subscribe((mutation, state) => {
    searchState.research = state.openResearch;
});

// Reset store, because in the search view there is no openPaper
useOpenPaperStore().resetStore();

getSearchResults([]);

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
