<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useNotesStore } from "../stores/notes";

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const notesStore = useNotesStore();

const noteData = ref({
  id: "",
  title: "",
  todos: []
});

const isNew = computed(() => props.id === "new");
const canUndo = computed(() => notesStore.currentIndex > -1);
const canRedo = computed(
  () => notesStore.currentIndex < notesStore.history.length - 1
);

onMounted(() => {
  if (isNew.value) {
    noteData.value = {
      id: crypto.randomUUID(),
      title: "",
      todos: []
    };
  } else {
    const note = notesStore.notes.find((n) => n.id === props.id);
    if (note) {
      noteData.value = JSON.parse(JSON.stringify(note));
    } else {
      router.push("/");
    }
  }
});

function addTodo() {
  noteData.value.todos.push({
    id: crypto.randomUUID(),
    text: "",
    completed: false
  });
}

function removeTodo(index) {
  if (confirm("Вы уверены, что хотите удалить эту задачу?")) {
    noteData.value.todos.splice(index, 1);
  }
}

function saveNote() {
  if (isNew.value) {
    notesStore.addNote(noteData.value);
  } else {
    notesStore.updateNote(noteData.value);
  }
  router.push("/");
}

function deleteNote() {
  if (confirm("Вы уверены, что хотите удалить эту заметку?")) {
    notesStore.deleteNote(noteData.value.id);
    router.push("/");
  }
}

function undoChange() {
  notesStore.undo();
}

function redoChange() {
  notesStore.redo();
}

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", preventUnload);
});

onMounted(() => {
  window.addEventListener("beforeunload", preventUnload);
});

function preventUnload(e) {
  const originalNote = notesStore.notes.find((n) => n.id === noteData.value.id);
  if (JSON.stringify(originalNote) !== JSON.stringify(noteData.value)) {
    e.preventDefault();
    e.returnValue = "";
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="mb-6 flex justify-between items-center">
      <input
        v-model="noteData.title"
        class="text-2xl font-bold bg-transparent border-b-2 border-gray-200 focus:border-blue-500 outline-none flex-grow mr-4"
        placeholder="Введите название заметки"
      />
      <div class="flex gap-2">
        <button
          @click="saveNote"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Сохранить
        </button>
        <button
          @click="deleteNote"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Удалить
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="(todo, index) in noteData.todos"
        :key="todo.id"
        class="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm"
      >
        <input
          type="checkbox"
          v-model="todo.completed"
          class="w-5 h-5 rounded border-gray-300 focus:ring-blue-500"
        />
        <input
          v-model="todo.text"
          class="flex-grow px-2 py-1 border-b border-transparent focus:border-blue-500 focus:outline-none"
          placeholder="Введите задачу"
        />
        <button
          @click="removeTodo(index)"
          class="text-red-500 hover:text-red-600 transition-colors"
        >
          <span class="sr-only">Удалить задачу</span>
          ✕
        </button>
      </div>

      <button
        @click="addTodo"
        class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-600 hover:text-blue-500 transition-colors"
      >
        + Добавить задачу
      </button>
    </div>

    <div class="mt-6 flex gap-2">
      <button
        @click="undoChange"
        :disabled="!canUndo"
        class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ↩ Отменить
      </button>
      <button
        @click="redoChange"
        :disabled="!canRedo"
        class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ↪ Повторить
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
