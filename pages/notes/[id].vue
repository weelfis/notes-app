<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useNotesStore } from "../../stores/notes";
import { useNoteEditor } from "../../use/useNotesHelper";
import { useRouteWatcher } from "../../use/useRouteWatcher";
import TodoItem from "../../components/TodoItem.vue";

const notesStore = useNotesStore();
const { save, note, isNew, dialogs, loadExistingNote, handleDeleteConfirm } =
  useNoteEditor();
const { updateRouteState } = useRouteWatcher();

onMounted(() => {
  notesStore.initializeFromStorage();
  loadExistingNote();
  updateRouteState();
  const storedNote = localStorage.getItem("currentNote");
  if (storedNote) {
    note.value = JSON.parse(storedNote);
  } else if (notesStore.getCurrentNote) {
    note.value = notesStore.getCurrentNote;
  }
});

const saveNote = () => {
  notesStore.setCurrentNote(note.value);
  save();
};

watch(
  () => note.value,
  (newNote) => {
    if (newNote) {
      localStorage.setItem("currentNote", JSON.stringify(newNote));
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto flex flex-col">
      <input
        v-model="note.title"
        class="text-2xl font-bold bg-transparent border-b mb-12 border-gray-300 focus:border-blue-500 outline-none"
        placeholder="Title"
      />
      <TodoItem :todos="note.todos" @update:todos="note.todos = $event" />

      <div class="flex justify-between items-center mt-4">
        <div class="space-x-4 flex">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
            @click="saveNote"
          >
            Save
          </button>
          <button
            v-if="!isNew"
            class="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
            @click="handleDeleteConfirm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-for="(dialog, index) in dialogs"
      :key="index"
      v-model="dialog.visible"
      :title="dialog.title"
      :message="dialog.message"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
