<template>
    <div class="d-flex justify-space-between gap-8">
        <organizer-dialog :slots="organizeSlots">
            <template v-for="slot in organizeSlots" v-slot:slot>
                <slot :name="slot"></slot>
            </template>
        </organizer-dialog>
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

defineProps<{
    slots: Slot[],
    organizeSlots: String[],
    rightButton?: string
}>()

defineEmits<{
    clickRightButton(): void
}>()

</script>

<style scoped>
#export-button {
    max-width: 300px;
}
</style>