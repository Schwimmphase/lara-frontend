<template>
    <v-card class="d-flex flex-column lara-card font-weight-bold" width="350" height="230" variant="flat" :id="getCardId(title)">
        <v-card-title class="font-weight-bold" :id="getCardId(title) + '-title'">
            {{ title }}
        </v-card-title>

        <v-card-text :id="getCardId(title) + '-description'">{{ truncate(description, 195) }}</v-card-text>
        <v-card-subtitle :id="getCardId(title) + '-started'">{{  $t('researchCard.startedOn', {startedOn: startedAt})  }}</v-card-subtitle>

        <v-card-actions class="ml-4 mr-4 mb-2 mt-2 pa-0">
            <lara-button type="primary" class="w-50" @click="openResearch(research)" :id="getCardId(title) + '-open'">
                {{ $t('researchCard.open') }}
            </lara-button>

            <v-spacer></v-spacer>

            <research-edit-dialog :title="title" :description="description"
                                  @save="(newTitle: string, newDescription: string) => onDataChange(newTitle, newDescription)"
                                  :id="getCardId(title) + '-edit'"/>

            <confirm-dialog @close="decision => { if (decision) $emit('delete') }">
                <v-btn size="small" color="red" variant="text" icon="mdi-delete" :title="$t('words.delete')"
                       :id="getCardId(title) + '-delete'"></v-btn>
            </confirm-dialog>
        </v-card-actions>
    </v-card>
</template>


<script setup lang="ts">
import LaraButton from "@/components/basic/LaraButton.vue";
import ResearchEditDialog from "@/components/dialogs/ResearchEditDialog.vue";
import type {Research} from "@/model/Research";
import router from "@/router";
import {useOpenResearchStore} from "@/stores/openResearch";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

defineProps(["id", "title", "description", "added", "enqueued", "startedAt", "research"]);


function onDataChange(title: string, description: string) {
    console.debug("Edit event received emitting data change event");
    emit("data-change", title, description);
}

const emit = defineEmits<{
    (event: 'data-change', title: string, description: string): void
    (event: 'delete'): void
}>();

function openResearch(research: Research) {
    useOpenResearchStore().setOpenResearch(research);
    router.push({ name: 'researchOverview', query: { research: research.id} });
}

function truncate(text: string, length: number) {
    if (text.length > length) {
        return text.substring(0, length - 3) + '...';
    }
    return text;
}


function getCardId(title: string): string {
    let id = "research-card-";
    let split = title.split(" ")[0];
    return id + split.substring(0, split.length > 4 ? 4 : split.length).toLowerCase();
}

</script>
