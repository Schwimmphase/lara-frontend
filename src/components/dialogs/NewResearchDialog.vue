<template>
    <div @click="openState.dialog = true">
        <slot></slot>
    </div>
    <v-dialog v-model="openState.dialog" id="dialog">
        <v-card>
            <v-card-title></v-card-title>
            <v-card-text>
                <v-form v-model="valid" v-on:submit.prevent>
                    <div class="d-flex flex-column gap-4">
                        <v-text-field :messages="state.titleMessages" class="lara-field" variant="outlined"
                                      v-model="state.title" :counter="maxTitleLength" id="new-research-title"
                                      :label="$t('newResearchDialog.title')"></v-text-field>
                        <v-textarea :messages="state.descriptionMessages" class="lara-field mt-4" variant="outlined"
                                      v-model="state.description" :counter="maxDescriptionLength"
                                      id="new-research-description" :label="$t('newResearchDialog.description')"
                        ></v-textarea>
                    </div>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-container>
                    <lara-button type="primary" @click="closeDialog" id="start-new-research-button">
                        {{ $t('home.startNewResearch') }}
                    </lara-button>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
import {reactive, watch} from "vue";
import LaraButton from "@/components/basic/LaraButton.vue";
import {i18n} from "@/internationalization/i18n";

let valid = false;

const maxTitleLength = 25;
const maxDescriptionLength = 110;

let titleMessage: string[];
let descriptionMessage: string[];

const emit = defineEmits<{
    (event: "save", title: string, description: string): void
}>();

let state = reactive({
    title: "",
    description: "",
    descriptionMessages: [''],
    titleMessages: [''],
    titleToLong: false,
    descriptionToLong: false,
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

    console.debug("Dialog closed emitting save event");

    emit("save", state.title, state.description);
    state.title = ""
    state.description = ""
    openState.dialog = false
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