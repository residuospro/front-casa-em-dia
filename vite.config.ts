import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { ClientSideLayout } from "vite-plugin-vue-layouts";
import Pages from "vite-plugin-pages";
import path from "path";

const env = loadEnv("all", process.cwd());
let port = Number(env.VITE_PORT);

const isDev =
  process.env.NODE_ENV === "development" || process.env.VITE_DEV === "true";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port,
    host: true,
  },

  plugins: [
    vue(),
    isDev && vueDevTools(),
    Pages({
      dirs: "src/pages",
      extensions: ["vue"],
      exclude: isDev
        ? ["**/__errors/*.vue"]
        : ["**/__dev/*.vue", "**/__errors/*.vue"],
    }),
    ClientSideLayout({
      layoutDir: "src/layouts",
      defaultLayout: "Default",
      importMode: "sync",
    }),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "Casa em dia",
        short_name: "Casa em dia",
        description: "Organize sua rotina e viva melhor.",

        theme_color: "#53864C",
        background_color: "#53864C",

        display: "standalone",
        orientation: "portrait",

        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [
          // URLs que não devem ser interceptadas pelo SW
          /^\/externa\//,
          /^\/login\//,
          /login/,
          /cadastro/,
          /no-sw=/,
        ],
        runtimeCaching: [
          {
            urlPattern: ({ url, request }) => {
              const isApiRequest = /\/externa\/.+/.test(url.pathname);

              const isTargetMethod = ["POST", "PUT", "DELETE"].includes(
                request.method,
              );
              return isApiRequest && isTargetMethod;
            },
            handler: "NetworkOnly",
            options: {
              backgroundSync: {
                name: "myQueueName",
                options: {
                  maxRetentionTime: 24 * 60, // Tempo máximo de retenção em minutos (neste caso, 24 horas)
                },
              },
            },
          },
        ],
      },

      devOptions: {
        navigateFallback: "index.html",
        suppressWarnings: true,
        enabled: true,
        type: "module",
      },
    }),
  ],
});
