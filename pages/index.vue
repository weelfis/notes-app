<script setup lang="ts">
import { ref, onMounted } from "vue";
import NoteCard from "../components/NoteCard.vue";
import TodoModal from "../components/TodoModal.vue";
import NoteIsNot from "../components/NoteIsNot.vue";
import { useNotesStore } from "../stores/notes";
import { useNotesList } from "../use/useNotesHelper";
import { useRouteWatcher } from "../use/useRouteWatcher";

const {
  notes,
  showConfirmDialog,
  handleConfirmDelete,
  initializeNotes,
  confirmDelete
} = useNotesList();

const { updateRouteState } = useRouteWatcher();
const notesStore = useNotesStore();

const showCreateNoteMessage = ref(false);
const showNote = ref(false);
const selectedNote = ref(null);

const handleNoteModal = (note: any) => {
  selectedNote.value = JSON.parse(JSON.stringify(note));
  showNote.value = true;
};

const handleCloseModal = () => {
  showNote.value = false;
  selectedNote.value = null;
};

onMounted(() => {
  initializeNotes();
  updateRouteState();

  setTimeout(() => {
    showCreateNoteMessage.value = true;
  }, 500);
});
</script>

<template>
  <NoteIsNot
    v-if="
      !notesStore.totalNotes && !notesStore.isNewNote && showCreateNoteMessage
    "
    :showCreateNoteMessage="showCreateNoteMessage"
  />

  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        class="transition-transform transform hover:scale-105 hover:shadow-lg hover:cursor-pointer"
        @confirmDelete="confirmDelete"
        @click="() => handleNoteModal(note)"
      />
    </div>

    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Удаление заметки"
      message="Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить."
      @confirm="handleConfirmDelete"
    />

    <TodoModal
      v-if="showNote && selectedNote"
      :note="selectedNote"
      @close="handleCloseModal"
    />
  </div>
</template>
