<script setup lang="ts">
    import DetailSidebarComponent from '@/components/detailSidebar/DetailSidebarComponent.vue';
    import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
    import LaraButton from '@/components/basic/LaraButton.vue';
    import { OpenPaper } from '@/stores/model/OpenPaper';
</script>

<template>
    <DetailSidebarComponent :open-paper="new OpenPaper(undefined, undefined, false)"/>

    <ConfirmDialog>
        <LaraButton  type="primary">Test</LaraButton>
    </ConfirmDialog>

</template>
