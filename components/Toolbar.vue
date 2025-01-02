<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { IButton } from "../types/index";

interface IProps {
  buttons: IButton[];
  isNew: boolean;
}
defineProps<IProps>();

const emit = defineEmits<{
  delete: [];
}>();

function handleKeydown(event: KeyboardEvent, button: IButton) {
  if (event.key === "Enter" && button.label === "Сохранить") {
    button.action();
  } else if (event.key === "Backspace" && button.label === "Отмена") {
    button.action();
  }
}
</script>

<template>
  <div class="flex justify-between items-center mb-8">
    <div class="space-x-4">
      <button
        v-for="button in buttons"
        :key="button.label"
        :class="button.class"
        tabindex="0"
        :disabled="button.disabled"
        @keydown="handleKeydown($event, button)"
        @click="button.action"
      >
        {{ button.label }}
      </button>
      <button
        v-if="!isNew"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        tabindex="0"
        @click="emit('delete')"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
