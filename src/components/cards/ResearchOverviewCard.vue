<template>

    <v-card class="d-flex flex-column lara-card w-100" height="230" variant="flat" :id="getCardId(paper.paper)">
        <v-card-title @click="$emit('open', paper)" class="font-weight-bold text-wrap lara-clickable"
                      :id="getCardId(paper.paper) + '-title'">
            {{ paper.paper.title }}
        </v-card-title>
        <v-card-text :id="getCardId(paper.paper) + '-comment'">{{ paper.comment }}</v-card-text>

        <!-- with add button -->
        <div v-if="addButton">
            <v-card-actions class="mx-4 mb-5 pa-0">
                <lara-button type="primary" style="max-width: 200px" @click="$emit('add')" :id="getCardId(paper.paper) + '-add'">
                    {{ $t('researchOverviewCard.add') }}
                </lara-button>

                <v-rating class="ml-4" v-if="paper.relevance !== 0" readonly :model-value="paper.relevance"
                          length="3" size="40" full-icon="mdi-star" empty-icon="mdi-star-outline" color="orange"></v-rating>
                <div class="ml-4 tags" :id="getCardId(paper.paper) + '-tags'">
                    <v-chip v-for="(tag, index) in paper.tags" :key="index" :color="tag.color" class="lara-chip mr-2"
                            :id="getCardId(paper.paper) + '-tag-' + tag.name.toLowerCase()">
                        {{ tag.name }}
                    </v-chip>
                </div>

                <v-spacer></v-spacer>

                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-open-in-new"
                       @click="$emit('export')" :title="$t('words.export')" :id="getCardId(paper.paper) + '-export'"></v-btn>
                <confirm-dialog @close="decision => { if (decision) $emit('delete') }">
                    <v-btn size="small" color="red" variant="text" icon="mdi-delete" :title="$t('words.remove')"
                           :id="getCardId(paper.paper) + '-delete'"></v-btn>
                </confirm-dialog>
            </v-card-actions>
        </div>

        <!-- without add button -->
        <div v-else>
            <v-card-actions class="ml-4 mr-4 mb-2 mt-2 pa-0">
                <!-- Tags -->
                <div class="d-flex gap-3 tags" :id="getCardId(paper.paper) + '-tags'">
                    <v-chip v-for="(tag, index) in paper.tags" :key="index" :color="tag.color" class="lara-chip mr-2"
                            :id="getCardId(paper.paper) + '-tag-' + tag.name.toLowerCase()">
                        {{ tag.name }}
                    </v-chip>
                </div>
                <div class="d-flex gap-3 ml-2">
                    <v-rating v-if="paper.relevance !== 0" readonly :model-value="paper.relevance" length="3" size="40"
                              full-icon="mdi-star" empty-icon="mdi-star-outline" color="orange"
                              :id="getCardId(paper.paper) + '-rating'"></v-rating>
                </div>
                <!-- Relevance -->
                <v-spacer></v-spacer>
                <!-- Export & Delete Buttons -->
                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-open-in-new"
                       @click="$emit('export')" :title="$t('words.export')" :id="getCardId(paper.paper) + '-export'"></v-btn>
                <confirm-dialog @close="decision => { if (decision) $emit('delete') }">
                    <v-btn size="small" color="red" variant="text" icon="mdi-delete" :title="$t('words.remove')"
                           :id="getCardId(paper.paper) + '-delete'"></v-btn>
                </confirm-dialog>
            </v-card-actions>
        </div>
    </v-card>

</template>


<script setup lang="ts">

import LaraButton from "@/components/basic/LaraButton.vue";
import type {SavedPaper} from "@/model/SavedPaper";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import type {Paper} from "@/model/Paper";


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

function getCardId(paper: Paper): string {
    let id = "overview-paper-card-";
    for (let i = 0; i < Math.min(paper.title.split(" ").length, 4); i++) {
        let split = paper.title.split(" ")[i];
        id += split.substring(0, split.length > 4 ? 4: split.length).toLowerCase() + "-";
    }
    return id.substring(0, id.length - 1);
}

</script>


<style scoped>

@import '../../assets/main.css';

.tags {
    max-width: 300px;
    overflow-x: scroll;
    float: left;
}

</style>