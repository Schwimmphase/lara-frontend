<template>
    <div @click="state.dialog = true">
        <slot></slot>
    </div>
    <v-dialog v-model="state.dialog">
        <v-card id="dialog">
            <v-card-title></v-card-title>
            <v-card-text>
                <v-form v-model="valid">
                    <div class="d-flex flex-column gap-4">
                        <v-text-field class="lara-field" variant="outlined"
                                      v-model="state.title" :counter="32"
                                      :label="$t('newResearchDialog.title')"></v-text-field>
                        <v-text-field class="lara-field" variant="outlined"
                                      v-model="state.description" :counter="256"
                                      :label="$t('newResearchDialog.description')"
                                      @keypress.enter="closeDialog">
                        </v-text-field>
                    </div>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-container>
                    <lara-button type="primary" @click="closeDialog">{{  $t('home.startNewResearch') }}</lara-button>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
import { reactive } from "vue";
import LaraButton from "@/components/basic/LaraButton.vue";

let valid = false;

const emit = defineEmits<{
    (event: "save", title: string, description: string): void
}>();

let state = reactive({
    dialog: false,
    title: "",
    description: ""
});

function closeDialog() {
    console.debug("Dialog closed emitting save event");

    state.title = ""
    state.description = ""
    state.dialog = false
    emit("save", state.title, state.description);
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
</style>