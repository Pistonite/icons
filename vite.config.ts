import { defineConfig } from 'vite';
import path from "path";
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "src",
  build: {
    outDir: path.join(__dirname, "target/frontend"),
    emptyOutDir: true,
  }
})
