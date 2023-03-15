import {reactive} from "@vue/reactivity";

export enum ApiErrors {
    wrongInput = "errorMsg.global.wrongInput",
    notAuthenticated = "errorMsg.global.notAuthenticated",
    notAuthorized = "errorMsg.global.notAuthorized",
    internalServerError = "errorMsg.global.internalServerError",
    unknownError = "errorMsg.global.unknownError",
    couldNotParseData = "errorMsg.global.couldNotParseData"
}

export const globalErrorSnackbar: {visible: boolean, timeout: number, error: string, message: string} = reactive({
    visible: false,
    timeout: 5000,
    error: '',
    message: ''
});

export const triggerGlobalError = function (error: string, message?: string) {
    globalErrorSnackbar.error = error;
    globalErrorSnackbar.message = message ?? '';
    globalErrorSnackbar.visible = true;
}