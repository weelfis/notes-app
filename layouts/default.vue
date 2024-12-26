<script setup>
import HeaderBase from "../components/HeaderBase.vue";
import FooterBase from "../components/FooterBase.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeaderBase />
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>
    <FooterBase />
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-blue-600;
}
</style>
