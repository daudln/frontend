<script setup lang="ts">
import { onMounted , ref} from 'vue';
import { axiosInstance } from '../service/api.service';

const userData = (localStorage.getItem('userProfile')) ? JSON.parse(localStorage.getItem('userProfile') || '{}') : null;
const jobs = ref();
onMounted(() => {
    axiosInstance.get("/jobs/").then(response => {
        jobs.value = response.data.results;
    }).catch(error => {
        console.error('Error fetching jobs:', error);
        alert('Failed to fetch jobs.');
    });
});

</script>
<template>
    <div class="w-full">
        <section class="form card w-full max-w-[980px] mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
            <h1 class="text-3xl font-bold mb-4 text-emerald-600">Welcome to Job Portal</h1>
            <p class="text-gray-700">Find your dream job from a variety of listings.</p>
        </section>
        <section class="form card w-full max-w-[980px] mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-3xl font-bold mb-4 text-emerald-600">Jobs</h1>
                <button class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600" v-if="userData && userData.user_type==='admin'">
                    <router-link to="/jobs/create" class="text-white">New Job</router-link>
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full table-auto table border-collapse border border-emerald-500 rounded-full">
                    <thead class="bg-emerald-100 border rounded-md">
                        <tr class="border border-emerald-500">
                            <th class="px-4 py-2 border border-emerald-500">Job Title</th>
                            <th class="px-4 py-2 border border-emerald-500">Company</th>
                            <th class="px-4 py-2 border border-emerald-500">Location</th>
                            <th class="px-4 py-2 border border-emerald-500">Posted Date</th>
                            <th class="px-4 py-2 border border-emerald-500">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="job in jobs" :key="job.pk">
                            <td class="border px-4 py-2 border-emerald-500">{{ job.title }}</td>
                            <td class="border px-4 py-2 border-emerald-500">{{ job.company_detail.name }}</td>
                            <td class="border px-4 py-2 border-emerald-500">{{ job.location }}</td>
                            <td class="border px-4 py-2 border-emerald-500">{{ new Date(job.posted_on).toLocaleDateString() }}</td>
                            <td class="border px-4 py-2 border-emerald-500">
                                <button class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 text-sm">
                                    <router-link :to="`/jobs/${job.unique_id}`" class="text-white">More</router-link>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </section>
    </div>
    <RouterView/>
</template>

