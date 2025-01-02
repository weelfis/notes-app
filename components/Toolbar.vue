<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface IProps {
  isNew: boolean;
}
defineProps<IProps>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div class="flex justify-between items-center mb-8">
    <div class="space-x-4">
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        @click="emit('save')"
      >
        Сохранить
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
