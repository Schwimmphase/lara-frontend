<template>
    <div class="d-flex justify-space-between gap-8 mt-8">
        <div class="d-flex gap-8">
            <organizer-dialog :slots="organizeSlots" @organize="$emit('organize')">
                <template v-for="slot in organizeSlots" v-slot:[slot.id]>
                    <slot :name="slot.id"></slot>
                </template>
            </organizer-dialog>

            <div class="d-flex gap-4">
                <v-chip v-for="(organizer, index) of selectedOrganizers" :key="index" class="lara-chip h-100" id="organizer-chip">
                    
                    <span id="organizer-chip-text">
                        {{ $t('slots.' + getOrganizerHumanName(organizer.name) ) }}: {{ organizer.argument }}
                    </span>

                    <!--<span id="organizer-chip-text">
                        {{ getOrganizerHumanName(organizer.name) }}: {{ organizer.argument }}
                    </span>-->
                    <v-btn size="small" variant="text" icon="mdi-close-circle" :title="$t('words.remove')"
                           @click="$emit('removeOrganizer', organizer.name)">
                    </v-btn>
                </v-chip>
            </div>
        </div>

        <lara-button type="primary" class="w-100" id="export-button" v-if="rightButton" @click="$emit('clickRightButton')">
            {{ rightButton }}
        </lara-button>
    </div>

    <div v-for="slot in slots">
        <h4 class="text-h4 font-weight-bold mt-8" v-if="slot.name" :id="'organizable-list-header-' + getId(slot.key)">
            {{ $t('slots.' + slot.key) }}
        </h4>
        <div class="d-flex flex-row flex-wrap mt-8 gap-8">
            <slot :name="slot.id"></slot>
        </div>
    </div>
</template>


<script setup lang="ts">
import LaraButton from "@/components/basic/LaraButton.vue";
import OrganizerDialog from "@/components/dialogs/OrganizerDialog.vue";
import type {Organizer} from "@/model/Organizer";

export interface Slot {
    id: string,
    name?: string,
    // Key for translations
    key: string
}

const props = defineProps<{
    slots: Slot[],
    organizeSlots: Slot[],
    rightButton?: string,
    selectedOrganizers: Organizer[]
}>();

defineEmits<{
    (event: "clickRightButton"): void
    (event: "organize"): void
    (event: "removeOrganizer", name: string): void
}>();

function getOrganizerHumanName(internalName: string): string {
    if (props.organizeSlots.filter(organizer => organizer.id === internalName).length > 0) {
        return props.organizeSlots.filter(organizer => organizer.id === internalName)[0].key as string;
    } else {
        console.warn("No human name for organizer '" + internalName + "'");
        return internalName;
    }
}

function getId(name: string): string {
    return name.toLowerCase().split(' ').join('-');
}
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