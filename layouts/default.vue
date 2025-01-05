<script setup>
import HeaderBase from "../components/HeaderBase.vue";
import FooterBase from "../components/FooterBase.vue";
import Notifications from "../components/Notifications.vue";
import { useRouter } from "vue-router";
import { useNotesStore } from "../store/useNotesStore";

const notesStore = useNotesStore();
const router = useRouter();

router.beforeEach((to, from, next) => {
  if (to.path.includes("notes")) {
    notesStore.removeCurrentNote();
  }

  next();
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Notifications />
    <HeaderBase />
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>
    <FooterBase />
  </div>
</template>
