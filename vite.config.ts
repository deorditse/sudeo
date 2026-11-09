import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: "@app", replacement: path.resolve(__dirname, "src/app") },
            { find: "@pages", replacement: path.resolve(__dirname, "src/pages") },
            { find: "@widgets", replacement: path.resolve(__dirname, "src/widgets") },
            { find: "@shared", replacement: path.resolve(__dirname, "src/shared") },
            { find: "@", replacement: path.resolve(__dirname, "src") },
        ],
    },
    css: {
        modules: {
            exportGlobals: false,
        },
    },
    build: {
        assetsInlineLimit: 0,
        outDir: "docs",
        emptyOutDir: false,
    },
});
