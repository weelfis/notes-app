<script setup lang="ts">
import { watch } from "vue";
import { useTodoItems } from "../use/useNotesHelper";

import type { TodoItem } from "../types/index";

interface Props {
  todos: TodoItem[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:todos": [todos: TodoItem[]];
  add: [];
  remove: [index: number];
}>();

const { todos, addTodo, removeTodo, updateTodo } = useTodoItems({
  todos: props.todos,
  onUpdateTodos: (newTodos) => emit("update:todos", newTodos),
  onAdd: () => emit("add"),
  onRemove: (index) => emit("remove", index)
});

watch(
  () => props.todos,
  (newTodos) => {
    if (JSON.stringify(newTodos) !== JSON.stringify(todos.value)) {
      todos.value = JSON.parse(JSON.stringify(newTodos));
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(todo, index) in todos"
      :key="todo.id"
      class="flex items-center space-x-4"
    >
      <input
        :checked="todo.completed"
        @change="updateTodo(index, { completed: !todo.completed })"
        class="w-5 h-5 cursor-pointer"
        type="checkbox"
        :disabled="!todo.text.trim()"
      />
      <input
        :value="todo.text"
        @input="
          updateTodo(index, { text: ($event.target as HTMLInputElement).value })
        "
        :class="[
          'flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none',
          { 'line-through text-gray-500': todo.completed }
        ]"
        placeholder="Задача"
      />
      <button
        class="text-red-500 hover:text-red-600"
        aria-label="Удалить задачу"
        @click="removeTodo(index)"
      >
        Удалить
      </button>
    </div>

    <button class="text-blue-500 hover:text-blue-600" @click="addTodo">
      Добавить задачу
    </button>
  </div>
</template>
