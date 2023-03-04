import {reactive} from "@vue/reactivity";

export enum ApiErrors {
    wrongInput = "errorMsg.global.wrongInput",
    notAuthenticated = "errorMsg.global.notAuthenticated",
    notAuthorized = "errorMsg.global.notAuthorized",
    internalServerError = "errorMsg.global.internalServerError",
    unknownError = "errorMsg.global.unknownError"
}

export const globalErrorSnackbar: {visible: boolean, timeout: number, errorMessage: string} = reactive({
    visible: false,
    timeout: 5000,
    errorMessage: ''
});

export const triggerGlobalError = function (errorMessage: string) {
    globalErrorSnackbar.errorMessage = errorMessage;
    globalErrorSnackbar.visible = true;
}