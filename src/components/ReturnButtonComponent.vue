<script setup lang="ts">

import router from '../router';

// Method to navigate back one page
let returnToLastPage = ():void => {
    router.back();
}

</script>

<template>
    <div>
        <div class="px-4 lara-button-div lara-button-secondary">
            <span class="lara-button text-button" @click="returnToLastPage()">Zurück</span>
        </div>
    </div>
</template>