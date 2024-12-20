<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <nav class="flex items-center justify-between h-16">
          <NuxtLink
            to="/"
            class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            Notes App
          </NuxtLink>

          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/"
              class="text-gray-600 hover:text-blue-600 transition-colors"
              active-class="text-blue-600"
            >
              All Notes
            </NuxtLink>
            <NuxtLink
              to="/notes/new"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              New Note
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="bg-white border-t mt-auto">
      <div class="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>
          &copy; {{ new Date().getFullYear() }} Notes App. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-blue-600;
}
</style>
