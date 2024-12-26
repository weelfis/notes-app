export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],

  app: {
    head: {
      title: "Notes App",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ]
    }
  },

  runtimeConfig: {
    apiSecret: "",

    public: {
      maxNotesPerUser: 100,
      maxTodosPerNote: 50,
      historyLimit: 50,
      apiBase: ""
    }
  },

  compatibilityDate: "2024-12-20"
});
