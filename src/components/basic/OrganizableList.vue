<template>
    <div class="d-flex justify-space-between gap-8">
        <div class="d-flex gap-8">
            <organizer-dialog :slots="organizeSlots" @organize="$emit('organize')">
                <template v-for="slot in organizeSlots" slot:[slot.id]>
                    <slot :name="slot.id"></slot>
                </template>
            </organizer-dialog>

            <div class="d-flex gap-4">
                <v-chip v-for="organizer of selectedOrganizers" class="lara-chip h-100" id="organizer-chip">
                    <span id="organizer-chip-text">{{ organizer.name }}: {{ organizer.value }}</span>
                    <v-btn size="small" variant="text" icon="mdi-close-circle"
                           @click="$emit('removeOrganizer', organizer.name)">

                    </v-btn>
                </v-chip>
            </div>
        </div>

        <lara-button type="primary" class="mt-4 w-100" id="export-button" v-if="rightButton" @click="$emit('clickRightButton')">
            {{ rightButton }}
        </lara-button>
    </div>

    <div v-for="slot in slots">
        <h4 class="text-h4 font-weight-bold mt-8" v-if="slot.name">{{ slot.name }}</h4>
        <div class="d-flex flex-row flex-wrap mt-8 gap-8">
            <slot :name="slot.id"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import LaraButton from "@/components/basic/LaraButton.vue";
import OrganizerDialog from "@/components/dialogs/OrganizerDialog.vue";

export interface Slot {
    id: String,
    name?: String
}

export interface Organizer {
    name: String,
    value: String
}

defineProps<{
    slots: Slot[],
    organizeSlots: Slot[],
    rightButton?: string,
    selectedOrganizers: Organizer[]
}>();

defineEmits<{
    (event: "clickRightButton"): void
    (event: "organize"): void
    (event: "removeOrganizer", name: String): void
}>();
</script>

<style scoped>
#export-button {
    max-width: 300px;
}

#organizer-chip {
    max-width: 250px;
}

#organizer-chip-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>