<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useNotesStore } from "../composables/useNotes";
import type { Note } from "../types";

const notesStore = useNotesStore();
const notes = computed(() => notesStore.notes);

onMounted(() => {
  notesStore.initializeFromStorage();
});

function confirmDelete(note: Note) {
  if (confirm("Are you sure you want to delete this note?")) {
    notesStore.deleteNote(note.id);
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">My Notes</h1>
      <NuxtLink
        to="/notes/new"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Note
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="note in notes"
        :key="note.id"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-semibold">{{ note.title }}</h2>
          <div class="flex space-x-2">
            <NuxtLink
              :to="`/notes/${note.id}`"
              class="text-blue-500 hover:text-blue-600"
            >
              Edit
            </NuxtLink>
            <button
              @click="confirmDelete(note)"
              class="text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="(todo, index) in note.todos.slice(0, 3)"
            :key="index"
            class="flex items-center"
          >
            <span
              class="w-4 h-4 border rounded mr-2"
              :class="{ 'bg-green-500': todo.completed }"
            />
            <span :class="{ 'line-through': todo.completed }">
              {{ todo.text }}
            </span>
          </div>
          <div v-if="note.todos.length > 3" class="text-gray-500 italic">
            ... and {{ note.todos.length - 3 }} more items
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
