import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, "src/popup/popup.html"),
                "service-worker": resolve(__dirname, "src/background/service-worker.ts"),
                contentScript: resolve(__dirname, "src/contentScript.ts"),
            },
            output: {
                entryFileNames: (chunk) => {
                    if (chunk.name === "popup") {
                        return "popup.js";
                    }
                    if (chunk.name === "service-worker") {
                        return "background/service-worker.js";
                    }
                    if (chunk.name === "contentScript") {
                        return "contentScript.js";
                    }
                    return "assets/[name]-[hash].js";
                },
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash][extname]",
            },
        },
    },
});
