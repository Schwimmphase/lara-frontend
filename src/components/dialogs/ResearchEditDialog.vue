<template>
    <div>
        <v-btn size="small" color="surface-variant" variant="text" icon="mdi-pencil" :title="$t('words.edit')"
               @click="state.dialog = true"></v-btn>
        <v-dialog v-model="state.dialog">
            <v-card id="dialog">
                <v-card-text>
                    <v-form v-model="valid">
                        <div class="d-flex flex-column">
                            <v-text-field class="lara-field" variant="outlined"
                                          v-model="state.title" :counter="32" :label="$t('researchEditDialog.title')"></v-text-field>
                            <v-textarea class="lara-field mt-4" variant="outlined"
                                        v-model="state.description" :counter="256" :label="$t('researchEditDialog.description')"></v-textarea>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-container>
                        <lara-button type="primary" @click="closeDialog">{{ $t('researchEditDialog.save') }}</lara-button>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>


<script setup lang="ts">
import { reactive } from "vue";
import LaraButton from "@/components/basic/LaraButton.vue";

const props = defineProps<{
    title: string,
    description: string
}>();

let state = reactive({
    dialog: false,
    title: props.title,
    description: props.description
});

let valid = false;

const emit = defineEmits<{
    (event: 'save', title: string, description: string): void
}>()

function closeDialog() {
    state.dialog = false
    console.debug("Dialog closed emitting save event");
    emit("save", state.title, state.description);
}

// TODO: rules
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