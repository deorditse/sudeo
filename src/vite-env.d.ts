/// <reference types="vite/client" />

declare module "*.module.scss" {
    const classes: Record<string, string>;
    export = classes;
}

interface ImportMetaEnv {
    readonly VITE_LEAD_ENDPOINT?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
