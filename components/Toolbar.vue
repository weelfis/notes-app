<script setup lang="ts">
import { defineProps } from "vue";
import type { IButton } from "../types/index";

interface IProps {
  buttons: IButton[];
  isNew: boolean;
}
defineProps<IProps>();

const emit = defineEmits<{
  delete: [];
}>();
</script>

<template>
  <div class="flex justify-between items-center mb-8">
    <div class="space-x-4">
      <button
        v-for="button in buttons"
        :key="button.label"
        :class="button.class"
        @click="button.action"
        :disabled="button.disabled"
      >
        {{ button.label }}
      </button>
      <button
        v-if="!isNew"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        @click="emit('delete')"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
