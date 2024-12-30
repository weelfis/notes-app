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
  <div :class="$style.test" class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-start mb-4">
      <h2 class="text-xl font-semibold truncate">{{ note.title }}</h2>
      <div class="flex space-x-2">
        <NuxtLink
          :to="`/notes/${note.id}`"
          class="text-blue-500 hover:text-blue-600"
        >
          Edit
        </NuxtLink>
        <button @click="confirmDelete" class="text-red-500 hover:text-red-600">
          Delete
        </button>
      </div>
    </div>

    <div class="space-y-2">
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
        ... and {{ note.todos.length - 3 }} more items
      </div>
    </div>
  </div>
</template>

<style module>
.test {
  height: 180px;
  min-height: 180px;
  max-height: 180px;
}
</style>
