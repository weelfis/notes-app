<script setup lang="ts">
import { onMounted } from "vue";
import NoteCard from "../components/NoteCard.vue";
import { useNotesList } from "../composables/useNoteEditor";

const {
  notes,
  showConfirmDialog,
  confirmDelete,
  handleConfirmDelete,
  initializeNotes
} = useNotesList();

onMounted(() => {
  initializeNotes();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @delete="confirmDelete"
      />
    </div>

    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Удаление заметки"
      message="Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить."
      @confirm="handleConfirmDelete"
    />
  </div>
</template>
