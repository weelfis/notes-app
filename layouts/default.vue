<script setup>
import HeaderBase from "../components/HeaderBase.vue";
import FooterBase from "../components/FooterBase.vue";
import Notifications from "../components/Notifications.vue";
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
