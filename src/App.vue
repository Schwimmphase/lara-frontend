<script setup lang="ts">
import {RouterView, useRoute} from 'vue-router'
import NavbarComponent from "@/components/NavbarComponent.vue";
import SidebarComponent from "@/components/sidebar/SidebarComponent.vue";
import {computed} from "vue";
import {globalErrorSnackbar} from "@/api/ApiErrors";

const route = useRoute();
const meta = computed(() => route.meta);

</script>


<template>
  <v-app>
      <NavbarComponent :show-logout="true"></NavbarComponent>
      <SidebarComponent v-if="meta.showSidebar" :show-search="(meta.showSearchInSidebar ? true : false)" :show-recommendations="(meta.showRecommendationsInSidebar ? true : false)"/>
      <v-main>
          <router-view :key="route.fullPath"></router-view>

          <v-snackbar v-model="globalErrorSnackbar.visible" :timeout="globalErrorSnackbar.timeout">
              {{ $t(globalErrorSnackbar.error, { 'message': globalErrorSnackbar.message }) }}
              <template v-slot:actions>
                  <v-btn color="pink" variant="text" @click="globalErrorSnackbar.visible = false">
                      {{ $t('words.close') }}
                  </v-btn>
              </template>
          </v-snackbar>
      </v-main>
  </v-app>

</template>


<style scoped>
</style>
