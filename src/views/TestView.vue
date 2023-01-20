<script setup lang="ts">
    import NavbarComponent from '../components/NavbarComponent.vue';
    import ReturnButtonComponent from '../components/ReturnButtonComponent.vue';
    import RecommendationsButtonComponent from '../components/RecommendationsButtonComponent.vue';
    import SidebarComponent from '../components/SidebarComponent.vue';
</script>

<template>
    <div>
        <NavbarComponent :show-logout="true"></NavbarComponent>
        <SidebarComponent />
        <v-main>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <p>asd</p>
            <ReturnButtonComponent />
            <RecommendationsButtonComponent />
        </v-main>
        
    </div>
</template>