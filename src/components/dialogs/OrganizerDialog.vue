<template>
    <div>
        <lara-button type="outline" icon="mdi-filter" class="w-100" id="filter-button" @click="state.dialog = true">
            {{ $t('organizableList.filterSettings') }}
        </lara-button>
        <v-dialog v-model="state.dialog">
            <v-card id="dialog">
                <v-card-text>
                    <v-form v-model="valid">
                        <div class="d-flex flex-column">
                            <div class="d-flex flex-row justify-space-between" v-for="slot in slots" >
                                <div class="w-25 d-flex align-center">
                                    <p class="text-h5 mt-auto mb-auto">{{ slot.name }}</p>
                                </div>
                                <slot :name="slot.id"></slot>
                            </div>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-container>
                        <lara-button type="primary" @click="closeDialog">{{ $t('organizableList.organizeButton') }}</lara-button>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>


<script setup lang="ts">
import { reactive } from "vue";
import LaraButton from "@/components/basic/LaraButton.vue";
import type { Slot } from "@/components/basic/OrganizableList.vue";

let state = reactive({
    dialog: false
})

let valid = false;

const props = defineProps<{
    slots: Slot[],
}>()

const emit = defineEmits<{
    (event: 'organize'): void
}>()

function closeDialog() {
    state.dialog = false
    console.debug("Dialog closed emitting organize event");
    emit("organize");
}
</script>


<style scoped>
#dialog {
    min-width: 300px;
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    border-radius: 0;
}

#filter-button {
    max-width: 300px;
    min-width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>