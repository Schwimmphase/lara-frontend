<template>
    <div v-ripple class="px-4 lara-button-div" :class="'lara-button-' + type + ' ' + (icon ? 'pr-8' : '')">
        <span class="lara-button text-button">
            <slot />
        </span>
        <v-icon :icon="icon" v-if="icon" class="lara-button-icon"></v-icon>
    </div>
</template>


<script setup lang="ts">
defineProps({
    type: String,
    icon: { type: String, required: false }
})
</script>


<style scoped>
.lara-button {
    user-select: none;
}

.lara-button-div {
    transition: background-color ease-in-out 0.3s;
    text-align: center;
}

.lara-button-div:hover {
    cursor: pointer;
}

.lara-button-primary {
    background-color: #000;
    color: #fff;
}

.lara-button-primary:hover {
    background-color: rgb(125, 125, 125);
}

.lara-button-secondary {
    background-color: rgb(71, 71, 71);
    color: #fff;
}

.lara-button-secondary:hover {
    background-color: rgb(157, 157, 157);
}

.lara-button-outline {
    background-color: rgb(255, 255, 255);
    border: 1px solid black;
    color: black;
}

.lara-button-secondary:hover {
    background-color: rgb(157, 157, 157);
}

.lara-button-icon {
    position: absolute;
    top: 6px;
    right: 10px;
    padding-left: 4px;
}
</style>