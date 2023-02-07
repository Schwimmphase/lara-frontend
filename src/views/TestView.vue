<script setup lang="ts">
    import DetailSidebarComponent from '@/components/DetailSidebarComponent.vue';
    import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
    import LaraButton from '@/components/basic/LaraButton.vue';
</script>

<template>
    <DetailSidebarComponent />

    <ConfirmDialog>
        <LaraButton  type="primary">Test</LaraButton>
    </ConfirmDialog>

</template>
