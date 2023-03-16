<template>
    <div>
<<<<<<< HEAD
        <v-btn size="small" color="surface-variant" variant="text" icon="mdi-pencil" @click="state.dialog = true"></v-btn>
        <v-dialog v-model="state.dialog" id="dialog">
            <v-card>
=======
        <v-btn size="small" color="surface-variant" :title="$t('words.edit')" variant="text" icon="mdi-pencil" @click="openState.dialog = true"></v-btn>
        <v-dialog v-model="openState.dialog">
            <v-card id="dialog">
>>>>>>> main
                <v-card-text>
                    <v-form v-model="valid">
                        <div class="d-flex flex-column">
                            <v-text-field :messages="state.titleMessages" class="lara-field" variant="outlined"
                                          v-model="state.title" :counter="maxTitleLength" :label="$t('researchEditDialog.title')"></v-text-field>
                            <v-textarea :messages="state.descriptionMessages" class="lara-field mt-4" variant="outlined"
                                        v-model="state.description" :counter="maxDescriptionLength" :label="$t('researchEditDialog.description')"></v-textarea>
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

import { i18n } from "@/internationalization/i18n";
import { watch } from "vue";

const maxDescriptionLength = 110;
const maxTitleLength = 25;

let titleMessage: string[];
let descriptionMessage: string[];

const props = defineProps<{
    title: string,
    description: string
}>();

let state = reactive({
    title: props.title,
    description: props.description,
    titleToLong: false,
    titleMessages: [''],
    descriptionToLong: false,
    descriptionMessages: [''],
    locale: ""
});

let openState = reactive({
    dialog: false,
});

watch(openState, () => {
    state.locale = i18n.global.locale.value;

    state.descriptionMessages = [''];
    state.titleMessages = [''];
    
    if (state.locale == "de") {
        titleMessage = [i18n.global.messages.value.de.newResearchDialog.titleTooLong];
        descriptionMessage = [i18n.global.messages.value.de.newResearchDialog.descriptionTooLong];
    } else {
        titleMessage = [i18n.global.messages.value.en.newResearchDialog.titleTooLong];
        descriptionMessage = [i18n.global.messages.value.en.newResearchDialog.descriptionTooLong];
    }

    if (state.titleToLong) {
        state.titleMessages = titleMessage;
    }

    if (state.descriptionToLong) {
        state.descriptionMessages = descriptionMessage;
    }
})

let valid = false;

const emit = defineEmits<{
    (event: 'save', title: string, description: string): void
}>()

function closeDialog() {

    let ret = false;

    state.titleToLong = false;
    state.descriptionToLong = false;

    if (state.description.length > maxDescriptionLength) {
        state.descriptionMessages = descriptionMessage;
        state.descriptionToLong = true;
        ret = true;
    }

    if (state.title.length > maxTitleLength) {
        state.titleMessages = titleMessage;
        state.titleToLong = true;
        ret = true;
    }

    if (ret) return;

    openState.dialog = false
    console.debug("Dialog closed emitting save event");
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