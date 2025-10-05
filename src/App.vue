<script setup lang="ts">
import AppNav from './components/layout/AppNav.vue';
</script>

<template>
  <AppNav />
  <main class="w-full">
    <RouterView link-active-class="text-emerald-500" />
  </main>
</template>
