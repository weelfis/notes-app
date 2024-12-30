<script setup lang="ts">
const links = [
  {
    to: "/",
    text: "Все заметки",
    class: "text-gray-600 hover:text-blue-600 transition-colors",
    activeClass: "text-blue-600"
  },
  {
    to: "/notes/new",
    text: "Новая заметка",
    class:
      "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors",
    activeClass: ""
  }
];
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between h-16">
        <NuxtLink
          to="/"
          class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Notes App
        </NuxtLink>
        <div class="flex items-center space-x-4">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            :class="link.class"
            :active-class="link.activeClass"
          >
            {{ link.text }}
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>
