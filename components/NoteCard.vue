<script setup lang="ts">
import type { Note } from "../types";

const emit = defineEmits<{
  (event: "confirmDelete", note: Note): void;
}>();

const props = defineProps({
  note: {
    type: Object as () => Note,
    required: true
  }
});

function confirmDelete() {
  emit("confirmDelete", props.note);
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 note-h">
    <div class="flex justify-between items-start mb-2">
      <h2 class="text-xl font-semibold truncate">{{ note.title }}</h2>
      <div class="flex space-x-2">
        <NuxtLink
          :to="`/notes/${note.id}`"
          class="text-blue-500 hover:text-blue-600"
        >
          Править
        </NuxtLink>
        <button @click="confirmDelete" class="text-red-500 hover:text-red-600">
          Удалить
        </button>
      </div>
    </div>

    <div class="space-y-1">
      <div
        v-for="todo in note.todos.slice(0, 3)"
        :key="todo.id"
        class="flex items-center"
      >
        <span
          :class="[
            { 'bg-green-500': todo.completed },
            'w-4 h-4 border rounded mr-2'
          ]"
        />
        <span :class="{ 'line-through': todo.completed }">
          {{ todo.text }}
        </span>
      </div>
      <div v-if="note.todos.length > 3" class="text-gray-500 italic">
        ... и ещё {{ note.todos.length - 3 }}
      </div>
    </div>
  </div>
</template>
