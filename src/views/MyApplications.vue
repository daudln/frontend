<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { axiosInstance } from '../service/api.service';
import { useRouter } from 'vue-router';
const token = localStorage.getItem('token');
if (!token) {
    useRouter().push('/login');
}
const applications = ref();

onMounted(() => {
    axiosInstance.get("/applications/my-applications/").then(response => {
        applications.value = response.data.results;
    }).catch(error => {
        console.error('Error fetching applications:', error);
        alert('Failed to fetch applications.');
    });
})
</script>
<template>
    <div class="w-full flex items-center justify-center mx-auto mt-8">
        <div class="bg-white shadow-md rounded-lg p-8 max-w-[980px] w-full text-center">
            <h1 class="text-2xl font-bold text-emerald-600 mb-4">My Applications</h1>
            <p class="text-gray-700 mb-6">Here are the jobs you have applied for:</p>
            <div class="mt-4">
                <ul class="list-disc list-inside">
                    <li v-for="application in applications" :key="application.job_detail.unique_id" class="mb-2">
                        <router-link :to="`/jobs/${application.job_detail.unique_id}`" class="text-blue-500 hover:underline">
                            {{ application.job_detail.title }}
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style>
    
</style>