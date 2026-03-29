export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-03-29',

  modules: ['@vite-pwa/nuxt'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'StreamBox',
      htmlAttrs: {
        lang: 'pl',
      },
      meta: [
        { name: 'description', content: 'Nowoczesna aplikacja streamingowa PWA w Nuxt 4.' },
        { name: 'theme-color', content: '#07131f' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'StreamBox' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icons/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192.png' },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      id: '/',
      name: 'StreamBox',
      short_name: 'StreamBox',
      description: 'Nowoczesna aplikacja streamingowa',
      theme_color: '#07131f',
      background_color: '#07131f',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})
