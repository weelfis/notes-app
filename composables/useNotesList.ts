import { ref, computed } from "vue";
import { useNotesStore } from "../store/useNotesStore";

import type { INote } from "../types/index";

export function useNotesList() {
  const notesStore = useNotesStore();
  const notes = computed(() => notesStore.notes);
  const showConfirmDialog = ref(false);
  const noteToDelete = ref<INote | null>(null);

  function confirmDelete(note: INote) {
    noteToDelete.value = note;
    showConfirmDialog.value = true;
  }

  function handleConfirmDelete() {
    if (noteToDelete.value) {
      notesStore.deleteNote(noteToDelete.value.id);
      noteToDelete.value = null;
    }
  }

  function initializeNotes() {
    notesStore.initializeFromStorage();
  }

  return {
    notes,
    showConfirmDialog,
    noteToDelete,
    confirmDelete,
    handleConfirmDelete,
    initializeNotes
  };
}
