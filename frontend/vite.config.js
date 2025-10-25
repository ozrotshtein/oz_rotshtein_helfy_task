import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,           // frontend runs on 3000
    strictPort: true,
    open: true
  }
});
