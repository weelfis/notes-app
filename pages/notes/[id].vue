<script setup lang="ts">
import { onMounted } from "vue";
import { useNoteEditor } from "../../use/useNotesHelper";
import { useRouteWatcher } from "../../use/useRouteWatcher";
import TodoItem from "../../components/TodoItem.vue";
import Toolbar from "../../components/Toolbar.vue";

const {
  save,
  note,
  isNew,
  dialogs,
  showDeleteDialog,
  loadExistingNote,
  handleDeleteConfirm
} = useNoteEditor();

const { updateRouteState } = useRouteWatcher();

onMounted(() => {
  loadExistingNote();
  updateRouteState();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <Toolbar :isNew="isNew" @delete="showDeleteDialog = true" @save="save" />
      <input
        v-model="note.title"
        class="text-2xl font-bold bg-transparent border-b mb-12 border-gray-300 focus:border-blue-500 outline-none"
        placeholder="Заголовок"
      />
      <TodoItem :todos="note.todos" @update:todos="note.todos = $event" />
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
