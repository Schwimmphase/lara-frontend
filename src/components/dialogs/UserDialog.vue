<template>
    <div @click="state.dialog = true">
        <slot></slot>
    </div>
    <v-dialog v-model="state.dialog">
        <v-card id="dialog">
            <v-card-title></v-card-title>
            <v-card-text>
                <v-form v-model="valid">
                    <div class="d-flex flex-column gap-4">
                        <v-text-field class="lara-field" variant="outlined"
                                      v-model="state.username" :counter="32"
                                      :label="$t('admin.userDialog.username')"></v-text-field>
                        <v-text-field class="lara-field" variant="outlined" type="password"
                                      v-model="state.password" :counter="256"
                                      :label="passwordChange ? $t('admin.userDialog.passwordNew') : $t('admin.userDialog.password')">
                        </v-text-field>
                        <v-select class="lara-field" :label="$t('admin.userDialog.userCategory')"
                                  variant="outlined" :items="userCategoriesString" v-model="state.userCategory">
                            <template v-slot:selection="{ item, index }">
                                <v-chip class="lara-chip" :color="userCategories.filter(category => category.name === item.title)[0].color">
                                    {{ item.title }}
                                </v-chip>
                            </template>
                        </v-select>
                    </div>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-container>
                    <lara-button type="primary" @click="closeDialog">{{ buttonText }}</lara-button>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
import type { User } from "@/model/User";
import { computed, reactive } from "vue";
import LaraButton from "@/components/basic/LaraButton.vue";
import type { UserCategory } from "@/model/UserCategory";

let valid = false;

const props = defineProps<{
    user?: User,
    userCategories: Array<UserCategory>,
    buttonText: string,
    passwordChange: boolean
}>();

const userCategoriesString = computed<String[]>(() => {
    let strings: String[] = [];
    for (let userCategory of props.userCategories) {
        strings.push(userCategory.name)
    }
    return strings;
})

const emit = defineEmits<{
    (event: "save", username: String, userCategory: UserCategory, password?: String): void
}>();

let state = reactive({
    dialog: false,
    username: props.user == undefined ? '' : props.user.username,
    password: '',
    userCategory: props.user == undefined ? null : props.user.userCategory.name,
    test: [''],
    userCategories: props.userCategories
});
function closeDialog() {
    state.dialog = false
    console.debug("Dialog closed emitting save event");
    let userCategory = state.userCategories.filter(category => category.name == state.userCategory)[0];

    if (state.password != '') {
        emit("save", state.username, userCategory, state.password);
    } else {
        emit("save", state.username, userCategory);
    }
}
</script>


<style scoped>
#dialog {
    min-width: 300px;
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    border-radius: 0;
}
</style>