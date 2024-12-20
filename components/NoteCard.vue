<script setup lang="ts">
import { computed } from "vue";
import type { Note } from "../types/index";

const props = defineProps<{
  note: Note;
}>();

defineEmits<{
  delete: [note: Note];
}>();

const displayedTodos = computed(() => props.note.todos.slice(0, 3));
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
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
          @click="$emit('delete', note)"
          class="text-red-500 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <TodoItem
        v-for="(todo, index) in displayedTodos"
        :key="todo.id"
        :todo="todo"
        :readonly="true"
      />
      <div v-if="note.todos.length > 3" class="text-gray-500 italic">
        ... and {{ note.todos.length - 3 }} more items
      </div>
    </div>
  </div>
</template>
