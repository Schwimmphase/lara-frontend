<template>
    <div>
        <lara-button type="outline" icon="mdi-filter" class="mt-4 w-100" id="filter-button">
            {{ $('organizableList.organizeButton') }}
        </lara-button>
        <v-dialog v-model="state.dialog" persistent>
            <v-card id="dialog">
                <v-card-text>
                    <v-form v-model="valid">
                        <div class="d-flex flex-column">
                            <div v-for="slot in slots">
                                <slot :name="slot"></slot>
                            </div>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-container>
                        <lara-button type="primary" @click="closeDialog">{{ $t('organizableList.organize') }}</lara-button>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import LaraButton from "@/components/basic/LaraButton.vue";

let state = reactive({
    dialog: false
})

let valid = false;

const props = defineProps<{
    slots: String[],
}>()

const emit = defineEmits<{
    (event: 'filter'): void
}>()

function closeDialog() {
    state.dialog = false
    console.debug("Dialog closed emitting filter event");
    emit("filter");
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