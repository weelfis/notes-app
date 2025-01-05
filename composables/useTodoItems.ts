import { ref, watch } from "vue";

import type { ITodoItem, IUseTodoItemsProps } from "../types/index";

export function useTodoItems({
  todos,
  onUpdateTodos,
  onAdd,
  onRemove
}: IUseTodoItemsProps) {
  const localTodos = ref<ITodoItem[]>(todos);

  watch(
    () => todos,
    (newTodos) => {
      localTodos.value = newTodos;
    },
    { deep: true }
  );

  function createTodo(): ITodoItem {
    return {
      id: crypto.randomUUID(),
      text: "",
      completed: false
    };
  }

  function addTodo() {
    const newTodo = createTodo();
    const newTodos = [...localTodos.value, newTodo];
    localTodos.value = newTodos;
    onUpdateTodos(newTodos);
    onAdd?.();
  }

  function removeTodo(index: number) {
    const newTodos = [...localTodos.value];
    newTodos.splice(index, 1);
    localTodos.value = newTodos;
    onUpdateTodos(newTodos);
    onRemove?.(index);
  }

  function updateTodo(index: number, updates: Partial<ITodoItem>) {
    const newTodos = [...localTodos.value];
    newTodos[index] = { ...newTodos[index], ...updates };
    localTodos.value = newTodos;
    onUpdateTodos(newTodos);
  }

  return {
    todos: localTodos,
    addTodo,
    removeTodo,
    updateTodo
  };
}
