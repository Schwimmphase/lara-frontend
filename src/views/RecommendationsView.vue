<script setup lang="ts">

import { useOpenPaperStore } from '@/stores/openPaper';
import {i18n} from "@/internationalization/i18n";
import TabbedView from "@/components/basic/TabbedView.vue";

document.title = i18n.global.t("pageTitles.recommendations") + " - lara";
useOpenPaperStore().resetStore();

</script>


<template>
    <tabbed-view></tabbed-view>
</template>