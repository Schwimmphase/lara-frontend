<script setup lang="ts">

import router from '../router';

// Method to navigate to the recommendations
let navigateToRecommendations = ():void => {
    router.push({ name: 'recommendations' });
}

</script>

<template>
    <div>
        <div class="px-4 lara-button-div lara-button-primary">
            <span class="lara-button text-button" @click="navigateToRecommendations()">Empfehlungen</span>
        </div>
    </div>
</template>