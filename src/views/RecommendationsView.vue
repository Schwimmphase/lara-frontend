<script setup lang="ts">

import OrganizableList from "@/components/basic/OrganizableList.vue";
import UnsavedPaperCard from "@/components/cards/UnsavedPaperCard.vue";

// TODO  Nur wegen Test
import { testPaperList } from "@/model/_testResearch";

import type { Paper } from "@/model/Paper";
import type { Research } from "@/model/Research";

import { useOpenResearchStore } from "@/stores/openResearch";

import { reactive } from "@vue/reactivity";

let slotsRecommended = [
    {id: "recommendations", name: "Empfehlungen"}
];

let slotsReferences = [
    {id: "citations", name: "Zitate"},
    {id: "references", name: "Referenzen"},
];

let state: { showCitations: boolean, citations: Paper[] | null, references: Paper[] | null, recommendations: Paper[] | null, research: Research | null } = reactive({
    showCitations: false,
    citations: null,
    references: null,
    recommendations: null,
    research: null,
});

let researchStore = useOpenResearchStore();

let setRecommendations = () => {
    state.research = researchStore.openResearch;

    state.recommendations = testPaperList;
    state.references = testPaperList;
    state.citations = testPaperList;

    // Get Paper Lists from API
}

setRecommendations();

</script>




<template>
    <div class="ma-4">
        <div class="d-flex">
            <span
                @click="state.showCitations = false"
                :class="{ 'font-weight-bold': !state.showCitations, 'lara-clickable': state.showCitations }"
                class="text-h4"
            >Empfohlen</span>
            <span
                @click="state.showCitations = true"
                :class="{ 'font-weight-bold': state.showCitations, 'lara-clickable': !state.showCitations }"
                class="text-h4 ml-3"
                >Zitate/Referenzen</span><br>
        </div>
        
        <div class="mt-3">
            <OrganizableList v-if="!state.showCitations" :slots="slotsRecommended">
                <template v-slot:recommendations>
                    <UnsavedPaperCard v-for="(paper, index) in state.recommendations" :key="index" :paper="paper" :research="(state.research ? state.research : undefined)" />
                </template>
            </OrganizableList>
            <OrganizableList v-if="state.showCitations" :slots="slotsReferences">
                <template v-slot:citations>
                    <UnsavedPaperCard v-for="(paper, index) in state.citations" :key="index" :paper="paper" :research="(state.research ? state.research : undefined)" />
                </template>
                <template v-slot:references>
                    <UnsavedPaperCard v-for="(paper, index) in state.references" :key="index" :paper="paper" :research="(state.research ? state.research : undefined)" />
                </template>
            </OrganizableList>
        </div>
    </div>
</template>

<style scoped>

@import '../assets/main.css';


</style>