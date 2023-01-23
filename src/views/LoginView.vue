<template>
    <v-form>
        <v-text-field class="lara-field" variant="outlined" label="username" v-model="loginData.userId" @keyup.enter="login"></v-text-field>
        <v-text-field class="lara-field" variant="outlined" label="password" v-model="loginData.password" @keyup.enter="login"></v-text-field>
        <lara-button type="primary" @click="login">Submit</lara-button>
    </v-form>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';
    import LaraButton from '@/components/basic/LaraButton.vue';
    import { AuthApiHandler } from '@/api/Auth/AuthApiHandler';

    let loginData = reactive({
        userId:"",
        password:"",
    });

    function login() {
        AuthApiHandler.login(loginData.userId, loginData.password);
    }
</script>
