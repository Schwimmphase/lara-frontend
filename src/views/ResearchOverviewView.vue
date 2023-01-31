<template>
    <v-container class="pt-8 px-16">
        <h1 class="text-h3 font-weight-bold">{{ $t('researchOverview.overview')  }} "{{ research != null ? research.title : null }}"</h1>
        <organizable-list :slots="slots">
            <template v-slot:added>
                <research-overview-card v-for="(savedPaper, index) in testSavedPaperList"
                                        :key="index"
                                        :title="savedPaper.paper.title"
                                        :comment="savedPaper.comment === undefined ? '' : savedPaper.comment.text"
                                        :tags="savedPaper.tags"
                                        :paper="savedPaper"
                                        @open-card="(paper) => openPaper(paper)"
                                        >
                </research-overview-card>
            </template>
            <template v-slot:enqueued>
                <research-overview-card v-for="(savedPaper, index) in testSavedPaperList"
                                        :key="index"
                                        :title="savedPaper.paper.title"
                                        :comment="savedPaper.comment === undefined ? '' : savedPaper.comment.text"
                                        :tags="savedPaper.tags"
                                        :paper="savedPaper"
                                        :add-button="true"
                                        @open-card="(paper) => openPaper(paper)"
                                        >
                </research-overview-card>
            </template>
            <template v-slot:hidden>
                <research-overview-card v-for="(savedPaper, index) in testSavedPaperList"
                                        :key="index"
                                        :title="savedPaper.paper.title"
                                        :comment="savedPaper.comment === undefined ? '' : savedPaper.comment.text"
                                        :tags="savedPaper.tags"
                                        :paper="savedPaper"
                                        @open-card="(paper) => openPaper(paper)"
                                        >
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
import { messages } from "@/internationalization/translations";

// Pinia store for the research
const store = useOpenResearchStore();

// TODO Nur zu Testzwecken drin... sobald die Research Papers gesetzt werden, kann das wieder weg
store.setResearchPapers(testSavedPaperList);

// Get the research from the store
let research: Research | null = store.getResearch;

let slots: Slot[] = [
    { id: "added" },
    { id: "enqueued", name: ('researchOverview.enqueued') }, // TODO: how do you insert translations in js?
    { id: "hidden", name: ('researchOverview.hidden') } // TODO: how do you insert translations in js?
];

let openPaper = (savedPaper: SavedPaper) => {
    router.push({ name: 'paperDetails', query: { research: savedPaper.research.id, paper: savedPaper.paper.paperId } });
}

</script>