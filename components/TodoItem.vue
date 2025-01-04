<script setup lang="ts">
import { watch } from "vue";
import { useTodoItems } from "../use/useNotesHelper";
import type { ITodoItem } from "../types/index";

interface IProps {
  todos: ITodoItem[];
  hideButton?: boolean;
  readOnly?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  hideButton: false,
  readOnly: false
});

const emit = defineEmits<{
  "update:todos": [todos: ITodoItem[]];
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
        :disabled="readOnly"
        :value="todo.text"
        @input="
          updateTodo(index, { text: ($event.target as HTMLInputElement).value })
        "
        :class="[
          'flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none',
          { 'line-through text-gray-500': todo.completed }
        ]"
        placeholder="Task name"
      />
      <button
        v-if="!hideButton && todos.length > 1 && index !== todos.length - 1"
        class="text-red-500 hover:text-red-600"
        aria-label="Delete task"
        @click="removeTodo(index)"
      >
        Remove
      </button>
      <button
        v-else-if="
          !hideButton && todos.length > 1 && index === todos.length - 1
        "
        class="text-blue-500 hover:text-blue-600"
        aria-label="Add task"
        @click="addTodo"
      >
        Add task
      </button>
    </div>
    <button
      v-if="!hideButton && todos.length < 2"
      class="text-blue-500 hover:text-blue-600"
      @click="addTodo"
    >
      Add task
    </button>
  </div>
</template>
