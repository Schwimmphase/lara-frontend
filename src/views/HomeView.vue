<template>

    <v-container class="w-75 pt-8">
        <h1 class="text-h3 font-weight-bold">{{ $t('home.greetings', {username: currentUser!.username}) }}</h1>

        <div style="width: 300px">
            <lara-button class="mt-8 mb-8" type="primary">{{ $t('home.startNewResearch') }}</lara-button>
        </div>

        <h2 class="text-h4 font-weight-bold">{{ $t('home.myResearches') }}</h2>

        <div class="mt-4 d-flex flex-wrap flex-row gap-8">
            <div v-for="research in researches">
                <research-card v-if="research != null"
                               :id="research.id"
                               :title="research.title"
                               :description="research.comment.text"
                               :added="69"
                               :enqueued="420"
                               :started-at="research.started.toLocaleDateString()"
                               :research="research"
                               @data-change="(newTitle: String, newDescription: String) => onEdited(research, newTitle, newDescription)"
                />
            </div>
        </div>
    </v-container>

</template>

<script setup lang="ts">

import ResearchCard from "@/components/cards/ResearchCard.vue";
import LaraButton from "@/components/basic/LaraButton.vue";
import type {Research} from "@/model/Research";
import { testResearch } from "@/model/_testResearch";
import { useCurrentUserStore } from "@/stores/currentUser";
import { ResearchApiHandler } from "@/api/Research/ResearchApiHandler";
import { useResearchesStore } from "@/stores/researches";

function onEdited(research: Research, title: String, description: String) {
    console.debug("New name and title for research: ");
    console.debug(research);
    console.debug("Title: " + title + " - description: " + description);
}

// get username & researches of user
let currentUser = useCurrentUserStore().getCurrentUser;
ResearchApiHandler.getAllResearchesByUser(currentUser!);
let researches = useResearchesStore().getResearches;
researches.push(testResearch);

</script>

<style>

</style>