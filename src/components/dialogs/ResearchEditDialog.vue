<template>
    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-pencil" @click="$emit('edit')"></v-btn>
    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-pencil">
        <v-dialog v-model="state.dialog" activator="parent" persistent>
            <v-card id="dialog">
                <v-card-text>
                    <v-form v-model="valid">
                        <div class="d-flex flex-column">
                            <v-text-field class="lara-field" variant="outlined"
                                          v-model="state.title" :counter="32" label="Titel"></v-text-field>
                            <v-textarea class="lara-field mt-4" variant="outlined"
                                        v-model="state.description" :counter="256" label="Beschreibung"></v-textarea>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-container>
                        <lara-button type="primary" @click="closeDialog">Speichern</lara-button>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>

</template>

<script setup lang="ts">
import {reactive} from "vue";
import LaraButton from "@/components/basic/LaraButton.vue";

const props = defineProps<{
    title: String,
    description: String
}>();

let state = reactive({
    dialog: false,
    title: props.title,
    description: props.description
});

let valid = false;

const emit = defineEmits<{
    (event: 'save', title: String, description: String): void
}>()

function closeDialog() {
    state.dialog = false
    console.debug("Dialog closed emitting save event");
    emit("save", state.title, state.description);
}

// rules
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
</style>