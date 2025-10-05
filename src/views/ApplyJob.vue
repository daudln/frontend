<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosInstance } from '../service/api.service';

const route = useRoute();
const router = useRouter()
const jobId = route.params.id;

const userData = (localStorage.getItem('userProfile')) ? JSON.parse(localStorage.getItem('userProfile') || '{}') : null;

if (!userData) {
    router.push('/login');
}

if (!jobId) {
    alert('Job ID is required to apply for a job.');
}

const form = ref({
    cv: null as File | null,
    cover_letter: null as File | null
});

const handleFileChange = (event: Event, type: 'cv' | 'cover_letter') => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        form.value[type] = target.files[0];
    }
};

const handleSubmit = async () => {
    if (!form.value.cv || !form.value.cover_letter) {
        alert('Please upload both CV and Application Letter.');
        return;
    }

    const formData = new FormData();
    formData.append('cv', form.value.cv);
    formData.append('cover_letter', form.value.cover_letter);

    try {
        const response = await axiosInstance.post(`/jobs/${jobId}/apply/`, formData);
        console.log('Application submitted successfully:', response.data);
        alert('Application submitted successfully!');
    } catch (error) {
        console.error('Error submitting application:', error);
        alert('Failed to submit application. Please try again.');
    }
};
</script>

<template>
    <div class="w-full flex items-center justify-center mx-auto mt-8">
        <div class="bg-white shadow-md rounded-lg p-6 max-w-[980px] w-full">
            <h1 class="text-2xl font-bold text-emerald-600 mb-4">Apply Job</h1>
            <form @submit.prevent="handleSubmit" class="form w-full max-w-[980px] mx-auto">
                <div class="form-group mb-4">
                    <label for="cv" class="block font-semibold mb-1">CV</label>
                    <input type="file" id="cv" name="cv" @change="event => handleFileChange(event, 'cv')" required />
                </div>
                <div class="form-group mb-4">
                    <label for="cover_letter" class="block font-semibold mb-1">Application Letter</label>
                    <input type="file" id="cover_letter" name="cover_letter" @change="event => handleFileChange(event, 'cover_letter')" required />
                </div>
                <div class="form-group mt-6">
                    <button type="submit" class="bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700">
                        Submit Application
                    </button>
                </div>
            </form>
            <router-link to="/jobs" class="text-emerald-500 hover:underline mt-4 inline-block">Go Back to Jobs</router-link>
        </div>
    </div>
</template>
