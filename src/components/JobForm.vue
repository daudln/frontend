<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient, axiosInstance } from '../service/api.service';
const router = useRouter();

export type Company = {
    pk: string,
    name: string
}

export type Location = {
    key: string,
    value: string
}

export type Response = {
    results: Company[];
}

const companies = ref<Company[]>([]);
const locations = ref<Location[]>([{
    key: "Remote",
    value: "REMOTE"
}, {
    key: "Dar es Salaam",
    value: "DAR ES SALAAM"
}, {
    key: "Other",
    value: "OTHER"

}]);

const form = defineModel({
    default: {
        title: '',
        description: '',
        responsibilities: '',
        qualifications: '',
        salary: 0,
        company: null,
        location: 'REMOTE',
        deadline: ''
    },
})

apiClient.get<Response>('/company/')
    .then((response) => {
        console.log(response)
        companies.value = response.results;
    })
    .catch(error => {
        console.error('Error fetching companies:', error);
        alert('Failed to fetch companies.');
    });

const createJob = async (event: Event) => {
    event.preventDefault();
    try {
        await axiosInstance.post('/jobs/', {
            title: form.value.title,
            description: form.value.description,
            responsibilities: form.value.responsibilities,
            qualifications: form.value.qualifications,
            salary: form.value.salary,
            company: form.value.company,
            location: form.value.location,
            deadline: form.value.deadline
        });
        await router.push('/jobs');
    } catch (error) {
        console.error('Error creating job:', error);
        alert('Failed to create job. Please try again.');
    }
};

</script>

<template>
    <div class="w-full">
        <form class="form w-full max-w-[980px] mx-auto p-6">
            <h1 class="text-3xl font-bold mb-4 text-emerald-600">Job Application</h1>
            <p class="text-gray-700">Please fill in the details below to create new job.</p>
            <div class="mb-4">
                <label for="title" class="block text-gray-700 font-bold">Title</label>
                <input type="text" id="title" class="w-full" v-model="form.title" required />
            </div>
            <div class="mb-4">
                <label for="descriptions" class="block text-gray-700 font-bold">Descriptions</label>
                <textarea id="descriptions" class="w-full" v-model="form.description" required></textarea>
            </div>
            <div class="mb-4">
                <label for="responsibility" class="block text-gray-700 font-bold">Responsibilities</label>
                <textarea id="responsibility" class="w-full" v-model="form.responsibilities" required></textarea>
            </div>
            <div class="mb-4">
                <label for="qualification" class="block text-gray-700 font-bold">Qualifications</label>
                <textarea id="qualification" class="w-full" v-model="form.qualifications" required></textarea>
            </div>
            <div class="mb-4">
                <label for="salary" class="block text-gray-700 font-bold">Salary</label>
                <input type="number" id="salary" class="w-full" v-model="form.salary" required />
            </div>
            <div class="mb-4">
                <label for="company" class="block text-gray-700 font-bold">Company</label>
                <select name="company" id="company" class="w-full" v-model="form.company" required>
                    <option v-for="company in companies" :value="company.pk">{{ company.name }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="location" class="block text-gray-700 font-bold">Location</label>
                <select name="location" id="location" class="w-full" v-model="form.location" required>
                    <option v-for="location in locations" :value="location.value">{{ location.key }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="deadline" class="block text-gray-700 font-bold">Deadline</label>
                <input type="date" id="deadline" class="w-full" v-model="form.deadline" required />
            </div>
            <button type="submit" @click="createJob"
                class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">Create</button>
        </form>
    </div>
</template>