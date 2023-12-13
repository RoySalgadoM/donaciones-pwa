import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    copyPublicDir: true,
    
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [{
          urlPattern: ({ url }) => {
            return url.pathname.startsWith("/api");
          },
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          },
        },
        {
          urlPattern: ({ url }) => {
            return url.pathname.startsWith("/");
          },
          handler: "NetworkFirst",
          options: {
            cacheName: "static-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          },
        }
        ]
      },

      includeAssets: [
        "**/*",
      ],
      immediate: true,
      manifest: {
        name: 'Donaciones App',
        short_name: 'Donaciones',
        description: 'Aplicación para administrar las donaciones de un ayuntamiento',
        theme_color: '#ffffff',
        screenshots: [
          {
            src: './icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: './icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: "wide",
            label: "Wonder Widgets"
          },
        ],
        icons: [
          {
            src: './icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: './icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: './icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
