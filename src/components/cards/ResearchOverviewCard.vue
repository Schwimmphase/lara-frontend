<template>
    <v-card class="d-flex flex-column lara-card" height="230" variant="flat">
        <v-card-title @click="$emit('openCard', paper)" class="font-weight-bold text-wrap lara-clickable">{{ title }}</v-card-title>
        <v-card-text>{{ comment }}</v-card-text>

        <div v-if="addButton">
            <v-container class="d-flex gap-4">
                <v-chip v-for="(tag, index) in tags" :key="index" :color="tag.color" class="lara-chip">{{ tag.name }}</v-chip>
            </v-container>

            <v-card-actions class="ml-4 mr-4 mb-2 mt-2 pa-0">
                <lara-button type="primary" style="max-width: 200px">Hinzufügen</lara-button>
                <v-spacer></v-spacer>
                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-open-in-new" @click="$emit('open')"></v-btn>
                <v-btn size="small" color="red" variant="text" icon="mdi-delete" @click="$emit('delete')"></v-btn>
            </v-card-actions>
        </div>
        <div v-else>
            <v-card-actions class="ml-4 mr-4 mb-2 mt-2 pa-0">
                <div class="d-flex gap-4">
                    <v-chip v-for="(tag, index) in tags" :key="index" :color="tag.color" class="lara-chip">{{ tag.name }}</v-chip>
                </div>
                <v-spacer></v-spacer>
                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-open-in-new" @click="$emit('open')"></v-btn>
                <v-btn size="small" color="red" variant="text" icon="mdi-delete" @click="$emit('delete')"></v-btn>
            </v-card-actions>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import LaraButton from "@/components/basic/LaraButton.vue";
import type {Tag} from "@/model/Tag";
import type {SavedPaper} from "@/model/SavedPaper";

defineProps<{
    title: String,
    comment: String,
    tags: Tag[],
    addButton?: Boolean,
    paper: SavedPaper
}>()
</script>

<style scoped>
    @import '../../assets/main.css';
</style>