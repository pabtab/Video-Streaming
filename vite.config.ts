import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: "src/main.ts",
        ui: "src/ui.ts",
        api: "src/api.ts",
        utils: "src/utils/index.ts",
      },
    },
  },
});
