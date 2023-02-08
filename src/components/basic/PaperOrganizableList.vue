<template>
    <organizable-list :slots="slots" :organize-slots="organizeSlots"
                      :right-button="$t('words.export')"
                      :selected-organizers="state.selectedOrganizers"
                      @click-right-button="emit('export', state.selectedOrganizers);"
                      @organize="emit('organize', state.selectedOrganizers);"
                      @remove-organizer="name => removeOrganizer(name, true)">
        <template v-for="slot in slots" v-slot:[slot.id]>
            <slot :name="slot.id"></slot>
        </template>

        <template v-slot:year-filter>
            <div class="w-100 mt-6 mx-5">
                <year-organizer :min="yearFilterState.min" :max="yearFilterState.max"
                                @year-change="(min, max) => onYearFilter(min,max)">
                </year-organizer>
            </div>
        </template>

        <template v-slot:year-sorter>
            <div class="w-100 mt-6 mx-5">
                <year-sorter @update="(sortByYear, descending) => onYearSorter(sortByYear, descending)" />
            </div>
        </template>
    </organizable-list>
</template>


<script setup lang="ts">
import type {Slot} from "@/components/basic/OrganizableList.vue";
import OrganizableList from "@/components/basic/OrganizableList.vue";
import {reactive} from "vue";
import YearOrganizer from "@/components/organizers/YearOrganizer.vue";
import {Organizer} from "@/model/Organizer";
import YearSorter from "@/components/organizers/YearSorter.vue";

defineProps<{
    slots: Slot[],
}>();

const emit = defineEmits<{
    (event: 'organize', selectedOrganizers: Organizer[]): void
    (event: 'export', selectedOrganizers: Organizer[]): void
}>();

let state: { selectedOrganizers: Organizer[] } = reactive({
    selectedOrganizers: []
});

let yearFilterState: { min: number, max: number } = reactive({
    min: 1900,
    max: (new Date()).getFullYear()
});

const organizeSlots: Slot[] = [
    { id: "year-filter", name: "Year Filter" },
    { id: "year-sorter", name: "Year Sorter"}
];

function setOrganizer(name: string, value: string): void {
    if (hasOrganizer(name)) {
        state.selectedOrganizers.splice(state.selectedOrganizers.findIndex(value => value.name === name), 1);
    }
    state.selectedOrganizers.push(new Organizer(name, value));
}

function removeOrganizer(name: string, shouldUpdate: boolean): void {
    if (hasOrganizer(name)) {
        state.selectedOrganizers.splice(state.selectedOrganizers.findIndex(value => value.name === name), 1);
    }

    if (shouldUpdate) {
        emit('organize', state.selectedOrganizers);
    }
}

function hasOrganizer(name: String): boolean {
    return state.selectedOrganizers.findIndex(value => value.name === name) !== -1;
}

// functions for specific organizers
function onYearFilter(min: number, max: number): void {
    setOrganizer('year-filter', min + '-' + max);
    yearFilterState.min = min;
    yearFilterState.max = max;
}

function onYearSorter(active: boolean, deciding: boolean): void {
    if (active) {
        setOrganizer("year-sorter", deciding ? "descending" : "ascending");
    } else {
        removeOrganizer("year-sorter", false);
    }
}
</script>

<style>

</style>
