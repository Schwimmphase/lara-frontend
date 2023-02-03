<template>
    <v-container id="login-form">
        <h1 class="text-h3 mt-16 text-sm-center font-weight-bold">{{ $t('login.login') }}</h1>

        <v-form class="mt-8">
            <v-text-field class="lara-field" variant="outlined" :label=" $t('login.userId') "
                          v-model="loginData.userId" @keyup.enter="login" autofocus></v-text-field>
            <v-text-field class="lara-field" variant="outlined" :label=" $t('login.password') "
                          v-model="loginData.password" @keyup.enter="login"></v-text-field>
            <lara-button type="primary" @click="login">{{ $t('login.button') }}</lara-button>
        </v-form>
    </v-container>
</template>


<script setup lang="ts">
import { reactive } from 'vue';
import LaraButton from '@/components/basic/LaraButton.vue';
import { AuthApiHandler } from '@/api/Auth/AuthApiHandler';
import router from '@/router';
import { useCurrentUserStore } from '@/stores/currentUser';
import { testUser } from '@/model/_testResearch';

let loginData = reactive({
    userId: "",
    password: "",
});

async function login(): Promise<void> {
    const token = await AuthApiHandler.login(loginData.userId, loginData.password);
    
    // parse token
    let tokenPayload = JSON.parse(atob(token.split('.')[1]));
    let expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + tokenPayload.exp); // this should not work but it does (but not completely correct) ???
    //let userNew = BasicApiHandler.buildUser(tokenPayload.user);
    // let isAdmin = tokenPayload.isAdmin;
    let userNew = testUser; // TODO: remove & uncomment the lines above once the backend people have updated the generation of jwt token
    let isAdmin = true; // TODO: remove once & uncomment the lines above the backend people have updated the generation of jwt token
    
    // create cookie for token
    document.cookie = "lara-token=" + token + ";expires=" + expiryDate.toUTCString(); + ";path=/";

    // store user
    useCurrentUserStore().setCurrentUser(userNew); 
    useCurrentUserStore().setAdmin(isAdmin);

    router.push({ name: 'home'});
}
</script>


<style>
#login-form {
    width: 300px;
}
</style>
