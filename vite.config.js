import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const buildProxy = (env) => {
  const proxy = {};

  if (env.VITE_API_PROXY_TARGET) {
    proxy["/api"] = {
      target: env.VITE_API_PROXY_TARGET,
      changeOrigin: true,
      secure: false,
    };
  }

  if (env.VITE_M3U8_PROXY_TARGET) {
    proxy["/m3u8-proxy"] = {
      target: env.VITE_M3U8_PROXY_TARGET,
      changeOrigin: true,
      secure: false,
    };
  }

  return proxy;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
    server: {
      proxy: buildProxy(env),
    },
  };
});
