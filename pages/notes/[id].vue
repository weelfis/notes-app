<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "../../stores/notes";
import type { Note } from "../../types/index";

const route = useRoute<{ id: string }>();
const router = useRouter();
const notesStore = useNotesStore();

const isNew = route.params.id === "new";
const note = ref<Note>({
  id: isNew ? crypto.randomUUID() : (route.params.id as string),
  title: "",
  todos: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

if (!isNew) {
  const existingNote = notesStore.notes.find((n) => n.id === route.params.id);
  if (existingNote) {
    note.value = JSON.parse(JSON.stringify(existingNote));
  } else {
    console.error("Note not found with the given ID.");
    router.push("/");
  }
}

const canUndo = computed(() => notesStore.currentIndex >= 0);
const canRedo = computed(
  () => notesStore.currentIndex < notesStore.history.length - 1
);

function addTodo() {
  const now = new Date();
  note.value.todos.push({
    id: crypto.randomUUID(),
    text: "",
    completed: false,
    createdAt: now,
    updatedAt: now
  });
}

function removeTodo(index: number) {
  note.value.todos.splice(index, 1);
}

function save() {
  note.value.updatedAt = new Date(); // Обновляем дату изменения
  if (isNew) {
    notesStore.addNote(note.value);
  } else {
    notesStore.updateNote(note.value);
  }
  router.push("/");
}

function cancel() {
  if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
    router.push("/");
  }
}

function confirmDelete() {
  if (confirm("Are you sure you want to delete this note?")) {
    notesStore.deleteNote(note.value.id);
    router.push("/");
  }
}

function undo() {
  notesStore.undo();
}

function redo() {
  notesStore.redo();
}
</script>
