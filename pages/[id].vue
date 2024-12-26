<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "../../stores/notes";
import type { Note, ConfirmDialogProps } from "../../types/index";
import ConfirmDialog from "../../components/ConfirmDialog.vue";

defineExpose({ open });

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();

const isNew = computed(() => route.params.id === "new");
const isConfirmDialogOpen = ref(false);
const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const note = ref<Note>({
  id: isNew.value ? crypto.randomUUID() : (route.params.id as string),
  title: "",
  todos: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

if (!isNew.value) {
  const existingNote = notesStore.notes.find((n) => n.id === route.params.id);
  if (existingNote) {
    note.value = JSON.parse(JSON.stringify(existingNote));
  }
}

const canUndo = computed(() => notesStore.currentIndex >= 0);
const canRedo = computed(
  () => notesStore.currentIndex < notesStore.history.length - 1
);

const newTodoText = ref("");

function addTodo() {
  if (newTodoText.value.trim()) {
    note.value.todos.push({
      id: crypto.randomUUID(),
      text: newTodoText.value.trim(),
      completed: false
    });
    newTodoText.value = "";
    nextTick(() => {
      newTodoInput.value?.focus();
    });
  }
}

function removeTodo(index: number) {
  note.value.todos.splice(index, 1);
}

function save() {
  if (isNew) {
    notesStore.addNote(note.value);
  } else {
    notesStore.updateNote(note.value);
  }
  router.push("/");
}

function cancel() {
  confirmDialog.value?.open({
    message: "Are you sure you want to cancel? All changes will be lost.",
    confirmAction: () => {
      console.log("Cancelled");
    }
  });
}

function undo() {
  notesStore.undo();
}

function redo() {
  notesStore.redo();
}

const newTodoInput = ref<HTMLInputElement | null>(null);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto flex flex-col gap-12">
      <input
        v-model="note.title"
        class="text-2xl font-bold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
        placeholder="Note Title"
      />
      <div class="space-x-4">
        <button
          @click="undo"
          :disabled="!canUndo"
          class="text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          @click="redo"
          :disabled="!canRedo"
          class="text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Redo
        </button>
        <button
          @click="save"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
        <button
          @click="cancel"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      <div class="space-y-4">
        <div
          v-for="(todo, index) in note.todos"
          :key="todo.id"
          class="flex items-center space-x-4"
        >
          <input
            v-model="todo.completed"
            class="w-5 h-5"
            type="checkbox"
            :disabled="!todo.text"
          />
          <input
            v-model="todo.text"
            :class="[
              { 'line-through': todo.completed },
              'flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none'
            ]"
            placeholder="Todo item"
          />
          <button
            @click="removeTodo(index)"
            class="text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <input
            ref="newTodoInput"
            v-model="newTodoText"
            class="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
            placeholder="Add a new todo item"
            @keyup.enter="addTodo"
          />
          <button @click="addTodo" class="text-blue-500 hover:text-blue-600">
            Add task
          </button>
        </div>
      </div>
    </div>
    <ConfirmDialog
      ref="confirmDialog"
      v-model="isConfirmDialogOpen"
      title="Confirm Action"
      message="Are you sure?"
    />
  </div>
</template>
