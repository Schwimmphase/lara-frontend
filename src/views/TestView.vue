<script setup lang="ts">

import DetailSidebarComponent from '@/components/DetailSidebarComponent.vue';
import LaraButton from '@/components/basic/LaraButton.vue';

import OrganizableList from '@/components/basic/OrganizableList.vue';
import MediumFilter from '@/components/organizers/VenueFilter.vue';

const slots = [];
const organizerSlots = [{name: "Medium Filter", id: 'medium-filter'}];

</script>

<template>
    <OrganizableList :slots="slots" :organize-slots="organizerSlots" :selected-organizers="[]">
        <template v-slot:medium-filter>
            <div class="w-100">
                <MediumFilter />
            </div>
        </template>
    </OrganizableList>

</template>
