export default defineNuxtConfig({
  compatibilityDate: '2026-10-19',
  devtools: { enabled: false },
  runtimeConfig: {
    public: { contactEndpoint: '' },
  },
  app: {
    head: {
      title: 'AIKangaroo',
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'description', content: 'VitaRay contactless health monitoring by AI Kangaroo. Sensing life. Protecting dignity.' }],
    },
  },
})
