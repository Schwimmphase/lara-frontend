<template>
    <v-card class="d-flex flex-column lara-card font-weight-bold" width="350" height="230" variant="flat">
        <v-card-title class="font-weight-bold">{{ title }}</v-card-title>

        <v-card-text>{{ description }}</v-card-text>

        <v-card-subtitle>{{ added }} hinzugefügt, {{ enqueued }} gemerkte Artikel</v-card-subtitle>
        <v-card-subtitle>gestartet am {{ startedAt }}</v-card-subtitle>

        <v-card-actions class="ml-4 mr-4 mb-2 mt-2 pa-0">
            <lara-button type="primary" class="w-50">Öffnen</lara-button>

            <v-spacer></v-spacer>

            <research-edit-dialog :title="title" :description="description"
                                  @save="(newTitle: String, newDescription: String) => onDataChange(newTitle, newDescription)" />
            <v-btn size="small" color="red" variant="text" icon="mdi-delete" @click="$emit('delete')"></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import LaraButton from "@/components/basic/LaraButton.vue";
import ResearchEditDialog from "@/components/dialogs/ResearchEditDialog.vue";

defineProps(["title", "description", "added", "enqueued", "startedAt"])

function onDataChange(title: String, description: String) {
    console.debug("Edit event received emitting data change event");
    emit("data-change", title, description)
}

const emit = defineEmits<{
    (event: 'data-change', title: String, description: String): void
}>()
</script>