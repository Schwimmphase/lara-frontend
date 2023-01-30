<template>
    <v-container class="pt-8 px-16">
        <h1 class="text-h3 font-weight-bold">Übersicht {{ research != null ? research.title : null }}</h1>
        <organizable-list :slots="slots" :organize-slots="organizeSlots" right-button="Exportieren"
                          :selected-organizers="selectedOrganizers">
            <template v-slot:added>
                <research-overview-card v-for="savedPaper in testSavedPaperList"
                                        :title="savedPaper.paper.title"
                                        :comment="savedPaper.comment === undefined ? '' : savedPaper.comment.text"
                                        :tags="savedPaper.tags">
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
import type {Organizer} from "@/components/basic/OrganizableList.vue";
import {testResearch, testSavedPaperList} from "@/model/_testResearch";
import type {Research} from "@/model/Research";
import {useResearchStore} from "@/stores/research";
import ResearchOverviewCard from "@/components/cards/ResearchOverviewCard.vue";
import type {Slot} from "@/components/basic/OrganizableList.vue";

// Pinia store for the research
const store = useResearchStore();

// TODO Nur zu Testzwecken drin... sobald die Research Papers gesetzt werden, kann das wieder weg
store.setOpenResearch(testResearch, testSavedPaperList);

// Get the research from the store
let research: Research | null = store.getResearch;

const organizeSlots: Slot[] = [];

const selectedOrganizers: Organizer[] = [];

let slots: Slot[] = [
    { id: "added" },
    { id: "enqueued", name: "Für später gemerkt" },
    { id: "hidden", name: "Ausgeblendet" }
]
</script>