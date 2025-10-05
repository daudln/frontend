<script setup lang="ts">
import router from '../../router';
import { axiosInstance } from '../../service/api.service';

const userData = (localStorage.getItem('userProfile')) ? JSON.parse(localStorage.getItem('userProfile') || '{}') : null;

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    router.push('/login');
    axiosInstance.post('/api/users/logout/');
};

</script>

<template>
    <nav class="bg-white shadow-md">
        <div class="max-w-[980px] mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <router-link to="/" class="text-2xl font-bold text-gray-900">Job <span class="text-emerald-500">Portal</span></router-link>
                    <div class="ml-10 flex space-x-4">
                        <router-link to="/jobs" class="text-gray-900 px-4 py-1 hover:text-emerald-500">Jobs</router-link>
                        <router-link to="/my-applications" class="text-gray-900 px-4 py-1" v-if="userData">My Applications</router-link>
                        <router-link to="/settings" class="text-gray-900 px-4 py-1" v-if="userData && userData.user_type === 'admin'">Settings</router-link>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <router-link to="/profile" class="text-gray-900 hover:text-emerald-500" v-if="userData">Profile</router-link>
                    <router-link v-if="!userData" to="/login" class="text-gray-900 hover:text-blue-500">Login</router-link>
                    <button v-if="userData" @click="logout">Logout</button>
                </div>
            </div>
        </div>
    </nav>
</template>
