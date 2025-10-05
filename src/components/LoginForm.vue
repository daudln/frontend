<script setup lang="ts">
import { ref } from 'vue';
import { axiosInstance } from '../service/api.service';
import { RouterLink, useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleSubmit = (event: MouseEvent) => {
    const endpoint = import.meta.env.VITE_API_BASE_URL;

  if (!endpoint) {
    throw new Error(
      "VITE_API_BASE_URL is not defined in environment variables"
    );
  }
    event.preventDefault();
    isLoading.value = true;
    axiosInstance.post(import.meta.env.VITE_API_BASE_URL+"/login/", {
    username: email.value,
    password: password.value
    }).then(response => {
        localStorage.setItem('token', response.data.token);
        axiosInstance.get('/api/users/me', {headers: { Authorization: `Token ${response.data.token}` }}).then(profileResponse => {
            const userProfile = profileResponse.data;
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }).catch(profileError => {
            console.error('Error fetching user profile:', profileError);
            alert('Failed to fetch user profile.');
        });
        router.push({path: '/jobs' });
    }).catch(error => {
        console.error('Login error:', error);
        alert('An error occurred while trying to log in.');
    });
    isLoading.value = false;
};
</script>

<template>
    <div class="w-full bg-white shadow-md rounded-lg h-[calc(100vh-80px)] flex flex-col justify-center">
        <section class="form card w-full max-w-md mx-auto">
            <h1 class="text-3xl font-bold mb-4 text-emerald-600">Welcom Back</h1>
            <form>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="text" id="email" name="email" v-model="email" required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" v-model="password" required />
                </div>
                <div class="form-group w-full">
                    <button type="submit" @click="handleSubmit" class="w-full disabled:cursor-not-allowed disabled:opacity-50" :disabled="isLoading">Login</button>
                </div>
                <div class="form-group">
                    <RouterLink to="/register" class="text-sm text-emerald-500 underline">Don't have an account? Register here.</RouterLink>
                </div>
            </form>
        </section>
    </div>
</template>
