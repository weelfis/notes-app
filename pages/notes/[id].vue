<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "../../stores/notes";
import type { Note, IButton } from "../../types/index";

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();

const showDeleteDialog = ref(false);
const showCancelDialog = ref(false);

const isNew = computed(() => route.params.id === "new");

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
    note.value = { ...existingNote };
  }
}

const canUndo = computed(() => notesStore.currentIndex >= 0);
const canRedo = computed(
  () => notesStore.currentIndex < notesStore.history.length - 1
);

const buttons: IButton[] = [
  {
    label: "↩",
    action: () => undoRedo("undo"),
    class: "text-gray-600 hover:text-gray-800 disabled:opacity-50",
    disabled: !canUndo.value
  },
  {
    label: "↪",
    action: () => undoRedo("redo"),
    class: "text-gray-600 hover:text-gray-800 disabled:opacity-50",
    disabled: !canRedo.value
  },
  {
    label: "Сохранить",
    action: save,
    class: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",
    disabled:
      note.value &&
      Array.isArray(note.value.todos) &&
      note.value.todos.length > 0
  },
  {
    label: "Отмена",
    action: cancel,
    class: "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600",
    disabled: false
  }
];

function addTodo() {
  note.value.todos.push({
    id: crypto.randomUUID(),
    text: "",
    completed: false
  });
}

function removeTodo(index: number) {
  note.value.todos.splice(index, 1);
}

function save() {
  if (isNew.value) {
    notesStore.addNote(note.value);
  } else {
    notesStore.updateNote(note.value);
  }
  router.push("/");
}

function cancel() {
  showCancelDialog.value = true;
}

function handleCancelConfirm() {
  router.push("/");
}

function confirmDelete() {
  showDeleteDialog.value = true;
}

function handleDeleteConfirm() {
  notesStore.deleteNote(note.value.id);
  router.push("/");
}

function undoRedo(action: "undo" | "redo") {
  if (action === "undo" && canUndo.value) {
    notesStore.undo();
  } else if (action === "redo" && canRedo.value) {
    notesStore.redo();
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div class="space-x-4">
          <button
            v-for="(button, index) in buttons"
            :key="index"
            :class="button.class"
            @click="button.action"
            :disabled="button.disabled"
          >
            {{ button.label }}
          </button>
          <button
            v-show="!isNew"
            @click="confirmDelete"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </div>
      <input
        v-model="note.title"
        class="border rounded p-2 w-full"
        :class="{ 'border-red-500': hasError }"
        placeholder="Note title"
      />
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
            placeholder="Задача"
          />
          <button
            @click="removeTodo(index)"
            class="text-red-500 hover:text-red-600"
          >
            Удалить
          </button>
        </div>

        <button @click="addTodo" class="text-blue-500 hover:text-blue-600">
          Добавить задачу
        </button>
      </div>
    </div>

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Удаление заметки"
      message="Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить."
      @confirm="handleDeleteConfirm"
    />

    <ConfirmDialog
      v-model="showCancelDialog"
      title="Отмена изменений"
      message="Вы уверены, что хотите отменить? Все несохраненные изменения будут потеряны."
      @confirm="handleCancelConfirm"
    />
  </div>
</template>
