<script setup lang="ts">

import LaraButton from './basic/LaraButton.vue';

</script>

<template>
    <v-navigation-drawer location="right" width="400">
        <div class="mx-2 my-3">
            <div class="d-flex flex-column">
                <span class="text-h5">{{ $t('detailSidebar.comments') }}</span>
                <v-textarea hide-details variant="outlined" class="mt-2 lara-field"></v-textarea>
                <lara-button class="mt-2" type="primary">{{ $t('detailSidebar.save') }}</lara-button>
            </div>
        </div>
    </v-navigation-drawer>
</template>