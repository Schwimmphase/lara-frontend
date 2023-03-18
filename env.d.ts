interface ImportMetaEnv {
    BASE_URL: string;
    VITE_API_HOST: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}