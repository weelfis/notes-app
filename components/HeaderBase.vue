<script setup lang="ts">
import { useNotesStore } from "../stores/notes";
import { useRoute } from "vue-router";
import { computed } from "vue";

const notesStore = useNotesStore();
const route = useRoute();

const currentLink = computed(() => {
  if (route.path.includes("notes")) {
    return {
      to: "/",
      text: `All notes (${notesStore.totalNotes})`,
      class: "text-gray-600 hover:text-blue-600 transition-colors",
      activeClass: "text-blue-600"
    };
  }

  return {
    to: "/notes/new",
    text: "New note",
    class:
      "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors",
    activeClass: ""
  };
});
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
        <div v-if="notesStore.totalNotes" class="flex items-center space-x-4">
          <NuxtLink
            :to="currentLink.to"
            :class="currentLink.class"
            :active-class="currentLink.activeClass"
          >
            {{ currentLink.text }}
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>
