<template>
    <div class="d-flex justify-space-between gap-8">
        <lara-button type="outline" icon="mdi-filter" class="mt-4 w-100" id="filter-button">Filtereinstellungen</lara-button>
        <lara-button type="primary" class="mt-4 w-100" id="export-button">Exportieren</lara-button>
    </div>
    <div v-for="slot in slots">
        <h4 class="text-h4 font-weight-bold mt-8" v-if="slot.name">{{ slot.name }}</h4>
        <div class="d-flex flex-column mt-8 gap-8">
            <slot :name="slot.id"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import LaraButton from "@/components/basic/LaraButton.vue";

export interface Slot {
    id: String,
    name?: String
}

defineProps<{
    slots: Slot[]
}>()

</script>

<style scoped>

#filter-button {
    max-width: 300px;
    min-width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

#export-button {
    max-width: 300px;
}
</style>