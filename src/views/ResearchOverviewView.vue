<template>
    <v-container class="pt-8 px-16">
        <h1 class="text-h3 font-weight-bold">Übersicht {{ research != null ? research.title : null }}</h1>
        <organizable-list :slots="slots">
            <template v-slot:added>
                <research-overview-card v-for="savedPaper in testSavedPaperList"
                                        :title="savedPaper.paper.title"
                                        :comment="savedPaper.comment === undefined ? '' : savedPaper.comment.text"
                                        :tags="savedPaper.tags"
                                        @click="openPaper(savedPaper)"
                                        >
                </research-overview-card>
            </template>
            <template v-slot:enqueued>
                <research-overview-card v-for="savedPaper in testSavedPaperList"
                                        :title="savedPaper.paper.title"
                                        :comment="savedPaper.comment === undefined ? '' : savedPaper.comment.text"
                                        :tags="savedPaper.tags"
                                        :add-button="true">
                </research-overview-card>
            </template>
            <template v-slot:hidden>
                <research-overview-card v-for="savedPaper in testSavedPaperList"
                                        :title="savedPaper.paper.title"
                                        :comment="savedPaper.comment === undefined ? '' : savedPaper.comment.text"
                                        :tags="savedPaper.tags">
                </research-overview-card>
            </template>
        </organizable-list>
    </v-container>
</template>

<script setup lang="ts">
import OrganizableList from "@/components/basic/OrganizableList.vue";
import {testResearch, testSavedPaperList} from "@/model/_testResearch";
import type {Research} from "@/model/Research";
import type { SavedPaper } from "@/model/SavedPaper";
import {useOpenResearchStore} from "@/stores/openResearch.js";
import ResearchOverviewCard from "@/components/cards/ResearchOverviewCard.vue";
import type {Slot} from "@/components/basic/OrganizableList.vue";
import router from "../router";

// Pinia store for the research
const store = useOpenResearchStore();

// TODO Nur zu Testzwecken drin... sobald die Research Papers gesetzt werden, kann das wieder weg
store.setOpenResearch(testResearch);
store.setResearchPapers(testSavedPaperList);

// Get the research from the store
let research: Research | null = store.getResearch;

let slots: Slot[] = [
    { id: "added" },
    { id: "enqueued", name: "Für später gemerkt" },
    { id: "hidden", name: "Ausgeblendet" }
];

let openPaper = (savedPaper: SavedPaper) => {
    router.push({ name: 'paperDetails', query: { research: savedPaper.research.id, paper: savedPaper.paper.paperId } });
}

</script>