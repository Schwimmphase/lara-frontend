<script setup lang="ts">

function logout() {
    // TODO Log out the user
    console.log("logout")
}

function checkAdmin() {
    // TODO Check if the user is an admin
    console.log("check Admin")
}

</script>

<template>
    <div class="lara-navbar">
        <v-app-bar>
            <span class="lara-navbar-link" @click="checkAdmin()">Nutzer verwalten</span>
            <router-link class="lara-navbar-link" :to="{ name: 'home' }">Start</router-link>
            <span class="lara-navbar-link" @click="logout()">Abmelden</span>
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

</style>