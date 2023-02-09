<script setup lang="ts">

import DetailSidebarComponent from '@/components/detailSidebar/DetailSidebarComponent.vue';
import LaraButton from '@/components/basic/LaraButton.vue';

import OrganizableList from '@/components/basic/OrganizableList.vue';
import MediumFilter from '@/components/organizers/VenueFilter.vue';
import { Organizer } from '@/model/Organizer';
import { reactive } from '@vue/reactivity';

const organizerSlots = [{name: "Medium Filter", id: 'medium-filter'}];


let state: { selectedVenues: string[] } = reactive({
    selectedVenues: [],
});

let test = () => {
    // Build venue Organizer
    let venueFilterValue: string = "";
    let separator = "";
    state.selectedVenues.forEach((value) => {
        venueFilterValue += separator;
        venueFilterValue += value;
        separator = ",";
    });

    console.log(venueFilterValue);
    let venueFilter = new Organizer('venue-filter', venueFilterValue);
}

</script>

<template>
    <OrganizableList :slots="[]" :organize-slots="organizerSlots" :selected-organizers="[]" @organize="test">
        <template v-slot:medium-filter>
            <div class="w-100">
                <MediumFilter :selected-venues="state.selectedVenues" @update="(asd) => state.selectedVenues = asd" />
            </div>
        </template>
    </OrganizableList>

</template>
