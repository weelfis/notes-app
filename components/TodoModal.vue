<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNotesStore } from "../stores/notes";
import TodoItem from "./TodoItem.vue";
import type { ITodoItem, INote } from "../types/index";

const props = defineProps<{
  note: INote;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const notesStore = useNotesStore();
const todos = ref<ITodoItem[]>([]);
const modalContent = ref<HTMLElement | null>(null);
const initialTodosState = ref("");

onMounted(() => {
  if (props.note) {
    todos.value = JSON.parse(JSON.stringify(props.note.todos));
    initialTodosState.value = JSON.stringify(props.note.todos);
  }
});

const handleClose = () => {
  if (props.note) {
    const currentTodosState = JSON.stringify(todos.value);

    if (currentTodosState !== initialTodosState.value) {
      const updatedNote = {
        ...props.note,
        todos: todos.value,
        updatedAt: new Date()
      };
      notesStore.updateNote(updatedNote);
    }
  }
  emit("close");
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    modalContent.value &&
    !modalContent.value.contains(event.target as Node)
  ) {
    handleClose();
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    @click="handleClickOutside"
  >
    <div
      ref="modalContent"
      class="modal-content bg-white p-6 rounded-lg max-w-lg w-full relative"
    >
      <button
        @click="handleClose"
        class="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close"
      >
        <i class="icon-close text-gray-500 hover:text-gray-700" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="pr-8">
        <h3 class="text-2xl font-semibold mb-4">{{ note.title }}</h3>

        <TodoItem v-model:todos="todos" hideButton readOnly />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  max-height: 80vh;
  overflow-y: auto;
  min-width: 320px;
}

@media (min-width: 640px) {
  .modal-content {
    min-width: 480px;
  }
}
</style>
