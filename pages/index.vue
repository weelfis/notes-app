<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useNotesStore } from "../composables/useNotes";
import NotesHeader from "../components/NotesHeader.vue";
import NoteCard from "../components/NoteCard.vue";

import type { Note } from "../types";

const notesStore = useNotesStore();
const notes = computed(() => notesStore.notes);
const showConfirmDialog = ref(false);
const noteToDelete = ref<Note | null>(null);

onMounted(() => {
  notesStore.initializeFromStorage();
});

function confirmDelete(note: Note) {
  noteToDelete.value = note;
  showConfirmDialog.value = true;
}

function handleConfirmDelete() {
  if (noteToDelete.value) {
    notesStore.deleteNote(noteToDelete.value.id);
    noteToDelete.value = null;
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <NotesHeader class="mb-8" />
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="note in notes">
        <NoteCard :note="note" @confirmDelete="confirmDelete" />
      </div>
    </section>

    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Delete Note"
      message="Are you sure you want to delete this note? This action cannot be undone."
      @confirm="handleConfirmDelete"
    />
  </div>
</template>
