<!--
    Komponente der Navbar, <UIC1&2>
    Bietet seitenunabhängige Navigation und Funktionen
-->

<script setup lang="ts">

import router from '../router';

// Propertie um anzugeben, ob der Logout-Link angezeigt werden soll
const props = defineProps({
    showLogout: Boolean
})


let items = [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ]

// language options from language service
// TODO get options from language service
let languages:string[] = [
    'german',
    'english'
];

let selectedLanguage: string;

// Function to logout the user
function logout(): void {
    // TODO Implement: Log out the user
    console.log("logout");

    // Navigate to the login view
    router.push({ name: 'login' });
}

// Method to check, if the user is a admin
function checkAdmin(): boolean {
    let isAdmin: boolean = true;
    
    console.log("Check admin");

    return isAdmin;
}

</script>

<template>
    <div class="lara-navbar-container">
        <v-app-bar :elevation="5" class="lara-navbar">
            <div class="ml-6">
                <v-app-bar-title>
                    <router-link :to="{ name: 'home' }" class="lara-icon-link">
                        <h2 class="font-weight-bold">lara.</h2>
                    </router-link>
                </v-app-bar-title>
            </div>
            <v-spacer></v-spacer>
            <div class="mr-6">
                <span class="lara-navbar-link" @click="logout()">Sprache ändern</span>
                <router-link class="pl-6 lara-navbar-link" v-if="checkAdmin()" :to="{ name: 'admin' }">Nutzer verwalten</router-link>
                <router-link class="pl-6 lara-navbar-link" :to="{ name: 'home' }">Start</router-link>
                <span v-if="showLogout" class="pl-6 lara-navbar-link" @click="logout()">Abmelden</span>
            </div>
        </v-app-bar>
    </div>
</template>

<style scoped>

.lara-navbar-link {
    color: #000;
    transition: color ease-in-out 0.3s;
}

.lara-navbar-link:hover {
    color: rgb(125, 125, 125);
    background: none;
    cursor: pointer;
}

.lara-icon-link {
    color: #000;
}

.lara-icon-link:hover {
    color: #000;
}

</style>