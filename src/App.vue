<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavbarComponent from "@/components/NavbarComponent.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";
//import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <v-app>
      <NavbarComponent :show-logout="true"></NavbarComponent>
      <SidebarComponent />
      <v-main>
          <router-view></router-view>
      </v-main>
  </v-app>
</template>

<style scoped>
</style>
