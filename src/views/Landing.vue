<script setup lang="ts">

</script>

<template>
    <div class="w-full h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100">
        <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
            <h1 class="text-4xl font-bold text-emerald-600 mb-4">Welcome to <span class="underline decoration-emerald-500 underline-offset-4"><span class="text-gray-900">Job</span> <span class="text-emerald-500">Portal</span></span></h1>
            <p class="text-gray-700 mb-6">Find your dream job from a variety of listings.</p>
            <router-link to="/jobs" class="text-emerald-500 hover:underline">Explore Jobs 👉</router-link>
        </div>
    </div>
</template>
