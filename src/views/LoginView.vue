<template>
    <v-form>
        <v-text-field class="lara-field" variant="outlined" label="username" v-model="state.userId" @keyup.enter="login"></v-text-field>
        <v-text-field class="lara-field" variant="outlined" label="password" v-model="state.password" @keyup.enter="login"></v-text-field>
        <lara-button type="primary" @click="login">Submit</lara-button>
    </v-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import LaraButton from '@/components/basic/LaraButton.vue';
import { AuthApiHandler } from '@/api/Auth/AuthApiHandler';
import router from '@/router';

    let state = reactive({
        userId:"",
        password:""
    });

    function login() {
        AuthApiHandler.login(state.userId, state.password);
        router.push({ name: 'home' });
    }
</script>