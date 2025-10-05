<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosInstance } from '../service/api.service';

const job = ref<any>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

// Get token once (reactive if needed, but localStorage is static)
const token = localStorage.getItem('token');

// Function to fetch job details
const fetchJob = async (id: string | string[]) => {
    // Normalize ID: route.params.id can be string or array in edge cases
    const jobId = Array.isArray(id) ? id[0] : id;

    if (!jobId) {
        router.push('/jobs');
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        const response = await axiosInstance.get(`/jobs/${jobId}/`);
        job.value = response.data;
    } catch (err: any) {
        console.error('Error fetching job details:', err);
        error.value = 'Failed to load job details.';
        job.value = null;
    } finally {
        loading.value = false;
    }
};

watch(() => route.params.id, async newId => {
    if (newId) {
        await fetchJob(newId);
    }
    else {
        router.push('/jobs');
    }
}, { immediate: true });
</script>

<template>
    <div>
        <!-- Loading State -->
        <div v-if="loading" class="w-full max-w-[980px] mx-auto mt-8 text-center">
            <p class="text-lg text-gray-600">Loading job details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="w-full max-w-[980px] mx-auto mt-8">
            <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center mx-auto">
                <h1 class="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
                <p class="text-gray-700 mb-6">{{ error }}</p>
                <router-link to="/jobs" class="text-blue-500 hover:underline">Go Back to Jobs</router-link>
            </div>
        </div>

        <!-- Job Found -->
        <section v-else-if="job" class="form card w-full max-w-[980px] mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
            <h1 class="text-3xl font-bold mb-4 text-emerald-600">{{ job.title }}</h1>
            <div class="mb-4"><strong>Company:</strong> {{ job.company_detail?.name || 'N/A' }}</div>
            <div class="mb-4"><strong>Location:</strong> {{ job.location || 'N/A' }}</div>
            <div class="mb-4"><strong>Description:</strong>
                <p>{{ job.description || 'No description available.' }}</p>
            </div>
            <div class="mb-4"><strong>Qualifications:</strong>
                <p>{{ job.qualifications || 'None listed.' }}</p>
            </div>
            <div class="mb-4"><strong>Responsibilities:</strong>
                <p>{{ job.responsibilities || 'None listed.' }}</p>
            </div>
            <div class="mb-4"><strong>Posted On:</strong> {{ job.posted_on ? new
                Date(job.posted_on).toLocaleDateString() : 'N/A' }}</div>
            <div class="mb-4"><strong>Deadline:</strong> {{ job.deadline ? new Date(job.deadline).toLocaleDateString() :
                'N/A' }}</div>

            <button class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
                <router-link :to="token ? `/jobs/${job.unique_id}/apply` : '/login'" class="text-white block">
                    {{ token ? 'Apply Now' : 'Login to Apply' }}
                </router-link>
            </button>
        </section>

        <!-- Job Not Found (explicit null or empty) -->
        <section v-else class="w-full max-w-[980px] mx-auto mt-8">
            <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center mx-auto">
                <h1 class="text-2xl font-bold text-red-600 mb-4">Job Not Found</h1>
                <p class="text-gray-700 mb-6">The job you are looking for does not exist.</p>
                <router-link to="/jobs" class="text-blue-500 hover:underline">Go Back to Jobs</router-link>
            </div>
        </section>

        <router-view />
    </div>
</template>