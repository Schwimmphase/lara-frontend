<script setup lang="ts">

import router from '../router';

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
                    <span class="font-weight-bold">lara.</span>
                </v-app-bar-title>
            </div>
            
            <v-spacer></v-spacer>
            <div class="mr-6 lara-navbar-link-collection">
                <v-menu>
                    moins
                </v-menu>
                <router-link class="lara-navbar-link" v-if="checkAdmin()" :to="{ name: 'admin' }">Nutzer verwalten</router-link>
                <router-link class="pl-6 lara-navbar-link" :to="{ name: 'home' }">Start</router-link>
                <span class="pl-6 lara-navbar-link" @click="logout()">Abmelden</span>
            </div>
        </v-app-bar>
        
    </div>
</template>

<style scoped>

.lara-navbar {
    /*
    display: flex;
    justify-content: center;
    align-items: center;
*/
    width: 100vw;
}



.lara-navbar-link {
    color: #000;
    transition: color ease-in-out 0.3s;
}

.lara-navbar-link:hover {
    color: rgb(125, 125, 125);
    background: none;
    cursor: pointer;
}

</style>