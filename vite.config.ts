import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
