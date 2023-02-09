<template>
    <v-card class="d-flex flex-column lara-card w-100" height="230" variant="flat">
        <v-card-title @click="$emit('open', paper)" class="font-weight-bold text-wrap lara-clickable">{{ paper.paper.title }}</v-card-title>
        <v-card-text>{{ paper.comment.text === undefined ? '' : paper.comment.text }}</v-card-text>

        <div v-if="addButton">
            <v-container class="d-flex gap-4">
                <v-chip v-for="(tag, index) in paper.tags" :key="index" :color="tag.color" class="lara-chip">{{ tag.name }}</v-chip>
            </v-container>

            <v-card-actions class="ml-4 mr-4 mb-2 mt-2 pa-0">
                <lara-button type="primary" style="max-width: 200px" @click="$emit('add')">
                    {{ $t('researchOverviewCard.add') }}
                </lara-button>
                <v-spacer></v-spacer>
                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-open-in-new" @click="$emit('export')"></v-btn>
                <confirm-dialog @close="decision => { if (decision) $emit('delete') }">
                    <v-btn size="small" color="red" variant="text" icon="mdi-delete"></v-btn>
                </confirm-dialog>
            </v-card-actions>
        </div>
        <div v-else>
            <v-card-actions class="ml-4 mr-4 mb-2 mt-2 pa-0">
                <div class="d-flex gap-4">
                    <v-chip v-for="(tag, index) in paper.tags" :key="index" :color="tag.color" class="lara-chip">{{ tag.name }}</v-chip>
                </div>
                <v-spacer></v-spacer>
                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-open-in-new" @click="$emit('export')"></v-btn>
                <confirm-dialog @close="decision => { if (decision) $emit('delete') }">
                    <v-btn size="small" color="red" variant="text" icon="mdi-delete"></v-btn>
                </confirm-dialog>
            </v-card-actions>
        </div>
    </v-card>
</template>


<script setup lang="ts">
import LaraButton from "@/components/basic/LaraButton.vue";
import type {SavedPaper} from "@/model/SavedPaper";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

defineProps<{
    addButton?: Boolean,
    paper: SavedPaper
}>()

defineEmits<{
    (event: 'delete'): void
    (event: 'open'): void
    (event: 'export'): void
    (event: 'add'): void
}>();
</script>


<style scoped>
    @import '../../assets/main.css';
</style>