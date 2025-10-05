<script setup lang="ts">
import { ref } from 'vue';
import { axiosInstance } from '../service/api.service';
import { RouterLink } from 'vue-router';

interface RegisterDetails {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}
const form = defineModel<RegisterDetails>({
    default: {
        email: "",
        password: "",
        first_name: "",
        last_name: "",
    }
})

const errors = ref<string[]>([]);

const handleSubmit = (event: MouseEvent) => {

    event.preventDefault();
    axiosInstance.post(import.meta.env.VITE_API_BASE_URL+"/users/register/", {
    first_name: form.value.first_name,
    last_name: form.value.last_name,
    email: form.value.email,
    password: form.value.password
    }).then(response => {
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.token);
    }).catch(error => {
        if (error.response && error.response.data) {
            errors.value = Object.values(error.response.data);
        } else {
            errors.value = ['An unexpected error occurred.'];
        }
    });
};
</script>

<template>
    <div class="w-full bg-white h-[calc(100vh-80px)] flex flex-col justify-center">
        <section class="form card w-full max-w-md mx-auto">
            <h1 class="text-3xl font-bold mb-4 text-emerald-600">Welcom Back</h1>
            <div v-if="errors.length" class="mb-4">
                <ul class="text-red-500">
                    <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
            </div>
            <p class="text-sm text-emerald-600 mb-4">Please fill in the form below to create an account.</p>
            <form>
                <div class="form-group">
                    <label for="first_name">First Name</label>
                    <input type="text" id="first_name" name="first_name" v-model="form.first_name" required />
                </div>
                <div class="form-group">
                    <label for="last_name">Last Name</label>
                    <input type="text" id="last_name" name="last_name" v-model="form.last_name" required />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="text" id="email" name="email" v-model="form.email" required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" v-model="form.password" required />
                </div>
                <div class="form-group w-full">
                    <button type="submit" @click="handleSubmit" class="w-full">Register</button>
                </div>
                <div class="form-group">
                    <p class="text-sm text-emerald-500">Have an account? <RouterLink to="/login">Login</RouterLink></p>
                </div>
            </form>
        </section>
    </div>
</template>
