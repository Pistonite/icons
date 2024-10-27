import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
import yaml from "@modyfi/vite-plugin-yaml"
import griffel from "@griffel/vite-plugin"

// @ts-expect-error @types/node
import fs from "fs";
// @ts-expect-error @types/node
import os from "os";

const https = () => {
  try {
    const home = os.homedir()+"/.cert";
    const key = home+"/cert.key";
    const cert = home+"/cert.pem";
    if (fs.existsSync(key) && fs.existsSync(cert)) {
        return { key, cert };
    }
  } catch (e) {
      // ignore
  }
  return undefined;
};

// https://vite.dev/config/
export default defineConfig(({command}) => ({
  plugins: [react(), yaml(), tsconfigPaths(), command === "build" && griffel()],
    server: {
        https: https(),
        proxy: {
            "/meta": "http://localhost:8000/",
            "/icon": "http://localhost:8000/",
        }
    }
}))
