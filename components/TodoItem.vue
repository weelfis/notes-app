<script setup lang="ts">
import type { TodoItem } from "../types/index";

defineProps<{
  todo: TodoItem;
  readonly?: boolean;
}>();

defineEmits<{
  remove: [];
}>();
</script>

<template>
  <div class="flex items-center space-x-4">
    <input
      type="checkbox"
      v-model="todo.completed"
      class="w-5 h-5"
      :disabled="readonly"
    />
    <input
      v-if="!readonly"
      v-model="todo.text"
      class="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
      placeholder="Todo item"
    />
    <span v-else :class="{ 'line-through': todo.completed }">
      {{ todo.text }}
    </span>
    <button
      v-if="!readonly"
      @click="$emit('remove')"
      class="text-red-500 hover:text-red-600"
    >
      Remove
    </button>
  </div>
</template>
