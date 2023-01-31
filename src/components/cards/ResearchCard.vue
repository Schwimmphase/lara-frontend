<template>
    <v-card class="d-flex flex-column lara-card font-weight-bold" width="350" height="230" variant="flat">
        <v-card-title class="font-weight-bold">{{ title }}</v-card-title>

        <v-card-text>{{ description }}</v-card-text>

        <v-card-subtitle>{{ $t('researchCard.addedAndEnqueuedPapers', {added: added, enqueued: enqueued}) }}</v-card-subtitle>
        <v-card-subtitle>{{  $t('researchCard.startedOn', {startedOn: startedAt})  }}</v-card-subtitle>

        <v-card-actions class="ml-4 mr-4 mb-2 mt-2 pa-0">
            <lara-button type="primary" class="w-50" @click="openResearch(research)">{{ $t('researchCard.open') }}</lara-button>

            <v-spacer></v-spacer>

            <research-edit-dialog :title="title" :description="description"
                                  @save="(newTitle: String, newDescription: String) => onDataChange(newTitle, newDescription)" />
            <v-btn size="small" color="red" variant="text" icon="mdi-delete" @click="$emit('delete')"></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">

import { ResearchApiHandler } from "@/api/Research/ResearchApiHandler";
import LaraButton from "@/components/basic/LaraButton.vue";
import ResearchEditDialog from "@/components/dialogs/ResearchEditDialog.vue";
import type { Research } from "@/model/Research";
import type { SavedPaper } from "@/model/SavedPaper";
import router from "@/router";
import { useOpenResearchStore } from "@/stores/openResearch";

defineProps(["id", "title", "description", "added", "enqueued", "startedAt", "research"]);

function onDataChange(title: String, description: String) {
    console.debug("Edit event received emitting data change event");
    emit("data-change", title, description);
}

const emit = defineEmits<{
    (event: 'data-change', title: String, description: String): void
}>();

function openResearch(research: Research) {
    useOpenResearchStore().setOpenResearch(research);
    router.push({ name: 'researchOverview', query: { research: research.id} });
}

</script>