<script setup lang="ts">
import {RouterView, useRoute} from 'vue-router'
import NavbarComponent from "@/components/NavbarComponent.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";
import {computed} from "vue";

const route = useRoute();
const currentRouteName = computed(() => route.name);
</script>

<template>
  <v-app>
      <NavbarComponent :show-logout="true"></NavbarComponent>
      <SidebarComponent v-if="currentRouteName !== 'login'" />
      <v-main>
          <router-view></router-view>
      </v-main>
  </v-app>
</template>

<style scoped>
</style>
