<script setup lang="ts">
import { useConfirmDialog } from "../use/useNotesHelper";

interface IProps {
  modelValue: boolean;
  title: string;
  message: string;
}

const props = defineProps<IProps>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();

const { buttons } = useConfirmDialog({
  modelValue: props.modelValue,
  onUpdateModelValue: (value) => emit("update:modelValue", value),
  onConfirm: () => emit("confirm")
});
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-xl font-semibold mb-4">{{ title }}</h3>
      <p class="text-gray-600 mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-4">
        <button
          v-for="(button, index) in buttons"
          :key="index"
          :class="button.class"
          @click="button.onClick"
        >
          {{ button.text }}
        </button>
      </div>
    </div>
  </div>
</template>
