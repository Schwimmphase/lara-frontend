<script setup lang="ts">

import router from '../router';
import LaraButton from "@/components/basic/LaraButton.vue";

// Method to navigate back one page
let returnToLastPage = ():void => {
    router.back();
}

</script>

<template>
    <lara-button type="secondary" @click="returnToLastPage">Zurück</lara-button>
</template>