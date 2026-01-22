/// <reference types="vitest/config" />
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      // For backwards compatibility with React 17
      jsxRuntime: "classic",
    }),
    dts({ rollupTypes: true, tsconfigPath: "./tsconfig.app.json" }),
  ],
  build: {
    lib: {
      entry: {
        "mfe-react-bridge": resolve(__dirname, "src/index.ts"),
        react17: resolve(__dirname, "src/react17.ts"),
      },
      name: "mfe-react-bridge",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  test: {
    environment: "jsdom",
  },
});
