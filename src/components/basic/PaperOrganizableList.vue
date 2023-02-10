<template>
    <organizable-list :slots="slots" :organize-slots="organizeSlots"
                      :right-button="exportEnabled ? $t('words.export') : undefined"
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
                <sorter :activated="yearSorterState.active" :descending="yearSorterState.descending"
                    @update="(sortByYear, descending) => onSorter(yearSorterState, 'year-sorter', sortByYear, descending)" />
            </div>
        </template>

        <template v-slot:venue-filter>
            <div class="w-100 mt-6 mx-5">
                <venue-filter @update="(venues) => onVenueFilter(venues)" :selected-venues="venueFilterState.selectedVenues" />
            </div>
        </template>

        <template v-slot:citations-sorter>
            <div class="w-100 mt-6 mx-5">
                <sorter :activated="citationsSorterState.active" :descending="citationsSorterState.descending"
                                  @update="(active, descending) => onSorter(citationsSorterState, 'citations-sorter', active, descending)" />
            </div>
        </template>

        <template v-slot:references-sorter>
            <div class="w-100 mt-6 mx-5">
                <sorter :activated="citationsSorterState.active" :descending="citationsSorterState.descending"
                        @update="(active, descending) => onSorter(citationsSorterState, 'citations-sorter', active, descending)" />
            </div>
        </template>
    </organizable-list>
</template>


<script setup lang="ts">
import type {Slot} from "@/components/basic/OrganizableList.vue";
import OrganizableList from "@/components/basic/OrganizableList.vue";
import {reactive} from "vue";
import YearOrganizer from "@/components/organizers/YearOrganizer.vue";
import VenueFilter from "../organizers/VenueFilter.vue";
import {Organizer} from "@/model/Organizer";
import Sorter from "@/components/organizers/Sorter.vue";

defineProps<{
    slots: Slot[],
    exportEnabled: boolean,
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

let yearSorterState: { active: boolean, descending: boolean} = reactive({
    active: false,
    descending: false
})

let venueFilterState: { selectedVenues: string[] } = reactive({
    selectedVenues: [],
});

let citationsSorterState: { active: boolean, descending: boolean} = reactive({
    active: false,
    descending: false
})

const organizeSlots: Slot[] = [
    { id: "year-filter", name: "Year Filter" },
    { id: "year-sorter", name: "Year Sorter"},
    { id: "venue-filter", name: "Venue Filter"},
    { id: "citations-sorter", name: "Venue Filter"},
    { id: "references-sorter", name: "References Sorter"},
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

    // clear organizer
    switch (name) {
        case "year-filter":
            yearFilterState.min = 1900;
            yearFilterState.max = (new Date()).getFullYear()
            break;
        case "year-sorter":
            yearSorterState.active = false;
            yearSorterState.descending = false;
            break;
        case "venue-filter":
            venueFilterState.selectedVenues = [];
            break;
    }

    if (shouldUpdate) {
        emit('organize', state.selectedOrganizers);
    }
}

function hasOrganizer(name: String): boolean {
    return state.selectedOrganizers.findIndex(value => value.name === name) !== -1;
}

// methods for specific organizers
function onYearFilter(min: number, max: number): void {
    setOrganizer('year-filter', min + '-' + max);
    yearFilterState.min = min;
    yearFilterState.max = max;
}

function onVenueFilter(venues: string[]) {
    venueFilterState.selectedVenues = venues;
    let value = "";
    let separator = ""
    venueFilterState.selectedVenues.forEach((venue) => {
        value += separator;
        value += venue;
        separator = ",";
    });

    setOrganizer('venue-filter', value);
}

function onSorter(state: any, name: string, active: boolean, descending: boolean): void {
    state.active = active;
    state.descending = descending;
    if (active) {
        setOrganizer(name, descending ? "descending" : "ascending");
    } else {
        removeOrganizer(name, false);
    }
}

</script>

<style>

</style>
