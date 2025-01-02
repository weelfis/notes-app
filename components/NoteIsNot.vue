<script setup lang="ts">
import { ref } from "vue";

const showCreateNoteMessage = ref(false);

setTimeout(() => {
  showCreateNoteMessage.value = true;
}, 500);

defineProps({
  showCreateNoteMessage: Boolean
});
</script>

<template>
  <div v-if="showCreateNoteMessage" class="flex flex-col items-center mt-4">
    <h3 class="text-3xl font-bold text-gray-800 mt-14">
      Пора записать что-то важное..
    </h3>
    <NuxtLink
      to="/notes/new"
      class="bg-blue-500 text-white px-4 py-2 rounded-md mt-14 hover:bg-blue-600 transition-colors text-center text-xl text-bold"
      activeClass="text-blue-600"
    >
      Создать заметку
    </NuxtLink>
  </div>
</template>
