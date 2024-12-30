<template>
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">My Notes</h1>
    <NuxtLink
      to="/notes/new"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      aria-label="Create a new note"
    >
      Создать
    </NuxtLink>
  </div>
</template>
