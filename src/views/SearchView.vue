<script setup lang="ts">
import { useOpenPaperStore } from '@/stores/openPaper';

useOpenPaperStore().resetStore();
</script>

<template>
    <span>SearchView</span>
</template>
