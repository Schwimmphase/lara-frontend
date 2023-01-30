<script setup lang="ts">
import {RouterView, useRoute} from 'vue-router'
import NavbarComponent from "@/components/NavbarComponent.vue";
import SidebarComponent from "@/components/sidebar/SidebarComponent.vue";
import {computed} from "vue";

const route = useRoute();
const currentRouteName = computed(() => route.name);
const meta = computed(() => route.meta);


</script>

<template>
  <v-app>
      <NavbarComponent :show-logout="true"></NavbarComponent>
      <SidebarComponent v-if="meta.showSidebar" :show-search="(meta.showSearchInSidebar ? true : false)" :show-recommendations="(meta.showRecommendationsInSidebar ? true : false)"/>  
      <v-main>
          <router-view :key="route.fullPath"></router-view>
      </v-main>
  </v-app>
</template>

<style scoped>
</style>