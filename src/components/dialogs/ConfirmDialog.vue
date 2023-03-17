<script setup lang="ts">

import { reactive } from 'vue';

import LaraButton from '../basic/LaraButton.vue';

const props = defineProps<{ openOnDefault?: boolean }>();

let state: { showDialog: boolean } = reactive({
    showDialog: !props.openOnDefault ? false : props.openOnDefault,
});

const emits = defineEmits(['close']);

// Method to pass the decision of the user to the parent
let close = (decision: boolean) => {
    state.showDialog = false;
    emits('close', decision);
}


</script>

<template>
    <div @click="state.showDialog = true">
        <slot></slot>
    </div>

    <v-dialog
        v-model="state.showDialog"
        class="dialog"
        persistent
    >
        <v-card class="lara-card">
            <div class="ma-5">
                <span class="text-h5 font-weight-bold" id="confirm-dialogue-message">{{ $t('confirmDialog.message') }}</span>
                <LaraButton class="mt-2" type="primary" @click="close(true)" id="confirm-dialogue-confirm-button">{{ $t('confirmDialog.confirm') }}</LaraButton>
                <LaraButton class="mt-4" type="secondary" @click="close(false)" id="confirm-dialogue-cancel-button">{{ $t('confirmDialog.cancel') }}</LaraButton>
            </div>
            
        </v-card>
    </v-dialog>    
</template>

<style scoped>

.dialog {
    min-width: 300px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    border-radius: 0;
}


</style>