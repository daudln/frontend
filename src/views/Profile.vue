<script setup lang="ts">
import { ref } from 'vue';
import { axiosInstance } from '../service/api.service';
import { useRouter } from 'vue-router';
const token = localStorage.getItem('token')

const router = useRouter();
;
if (!token) {
    useRouter().push('/login');
}

const userData = ref();

axiosInstance.get('/api/users/me/').then(response => {
    localStorage.setItem('userProfile', JSON.stringify(response.data));
    userData.value = response.data;
}).catch(error => {
    console.error('Error fetching user profile:', error);
    alert('Failed to fetch user profile. Please try again.');
});

if (!userData) {
    router.push('/login');
}

const updateProfile = async (event: Event) => {
    event.preventDefault();
    try {
        
        const response = await axiosInstance.put(`/users/${userData.value.id}/`, {
            first_name: userData.value.first_name,
            last_name: userData.value.last_name,
            email: userData.value.email,
            profile: {
                phone_number: userData.value.profile.phone_number,
                address: userData.value.profile.address,
                date_of_birth: userData.value.profile.date_of_birth,
                points: userData.value.profile.points
            }
        });
        localStorage.setItem('userProfile', JSON.stringify(response.data));
        userData.value = response.data;
        alert('Profile updated successfully!');
    } catch (error) {
        alert('Failed to update profile. Please try again.');
    }
};
</script>
<template>
    <div class="w-full flex items-center justify-center mx-auto mt-8">
        <div class="bg-white shadow-md rounded-lg p-6 max-w-[980px] w-full">
            <h1 class="text-2xl font-bold text-emerald-600 mb-4">Profile</h1>
            <form @submit.prevent="updateProfile" class="form w-full max-w-[980px] mx-auto">
                <div class="form-group mb-4">
                    <label for="first_name" class="block font-semibold mb-1">First Name</label>
                    <input type="text" id="first_name" v-model="userData.first_name" required class="w-full p-2 border rounded" />
                </div>
                <div class="form-group mb-4">
                    <label for="last_name" class="block font-semibold mb-1">Last Name</label>
                    <input type="text" id="last_name" v-model="userData.last_name" class="w-full p-2 border rounded" />
                </div>
                <div class="form-group mb-4">
                    <label for="email" class="block font-semibold mb-1">Email</label>
                    <input type="email" id="email" readonly v-model="userData.email" required class="w-full p-2 border rounded" />
                </div>
                <div class="form-group mb-4">
                    <label for="phone" class="block font-semibold mb-1">Phone</label>
                    <input type="text" id="phone" v-model="userData.profile.phone_number" required class="w-full p-2 border rounded" />
                </div>
                <div class="form-group mb-4">
                    <label for="address" class="block font-semibold mb-1">Address</label>
                    <input type="text" id="address" v-model="userData.profile.address" required class="w-full p-2 border rounded" />
                </div>
                <div class="form-group mb-4">
                    <label for="date_of_birth" class="block font-semibold mb-1">Date of Birth</label>
                    <input type="date" id="date_of_birth" v-model="userData.profile.date_of_birth" required class="w-full p-2 border rounded" />
                </div>
                <div class="form-group mb-4">
                    <label for="bio" class="block font-semibold mb-1">Points</label>
                    <input type="number" readonly v-model="userData.profile.points" class="w-full p-2 border rounded" rows="4" />
                </div>
                <button type="submit" @click="updateProfile" class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">Update Profile</button>
            </form>
        </div>
    </div>
</template>