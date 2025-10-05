<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosInstance } from '../service/api.service';

const route = useRoute();
const router = useRouter();

// Get user data
const userData = localStorage.getItem('userProfile')
    ? JSON.parse(localStorage.getItem('userProfile') || '{}')
    : null;

// Default tab is 'institution', fallback if invalid
const validTabs = ['institution', 'jobs', 'users'] as const;
type Tab = typeof validTabs[number];

// Computed: current tab from query param
const currentTab = computed<Tab>(() => {
    const tab = route.query.tab;
    if (typeof tab === 'string' && validTabs.includes(tab as Tab)) {
        return tab as Tab;
    }
    return 'institution'; // default
});

// Update URL when tab changes
const changeTab = (newTab: Tab) => {
    router.push({ query: { ...route.query, tab: newTab } });
};

// Watch for external changes (e.g. back button)
watch(
    () => route.query.tab,
    () => {
        // No need to do anything — `currentTab` is reactive
        // But you could trigger side effects here if needed
    }
);

// ===== Rest of your logic (institutions, forms, etc.) =====
const institutions = ref<Institution[]>([]);
const selectedInstitution = ref<Institution | null>(null);
const selectedUser = ref<any>(null);

interface Institution {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    email: string;
    website: string;
}

onMounted(() => {
    axiosInstance.get('/company/')
        .then(response => {
            institutions.value = response.data.results || response.data;
        })
        .catch(error => {
            console.error('Error fetching institution settings:', error);
        });
});

const form = ref({
    name: '',
    address: '',
    phone_number: '',
    email: '',
    website: '',
});

const userForm = ref({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    user_type: '',
    password: '',
    date_of_birth: null,
});

const userTypeChoices = ref([
    { name: 'Applicant', value: 'applicant' },
    { name: 'Recruiter', value: 'recruiter' },
    { name: 'Admin', value: 'admin' },
]);

// Watch selectedInstitution to populate form
watch(selectedInstitution, (inst) => {
    if (inst) {
        form.value = { ...inst };
    }
});

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
        if (selectedInstitution.value) {
            const res = await axiosInstance.put(`/company/${selectedInstitution.value.id}/`, form.value);
            // Optional: update list
            const idx = institutions.value.findIndex(i => i.id === res.data.id);
            if (idx !== -1) institutions.value[idx] = res.data;
        } else {
            const res = await axiosInstance.post('/company/', form.value);
            institutions.value.push(res.data);
        }
        // Reset
        selectedInstitution.value = null;
        form.value = { name: '', address: '', phone_number: '', email: '', website: '' };
    } catch (err) {
        console.error('Error saving institution:', err);
    }
};

const handleCreateUser = async (e: Event) => {
    e.preventDefault();
    try {
        if (selectedUser.value) {
            await axiosInstance.put(`/users/${selectedUser.value.pk}/`, userForm.value);
        } else {
            await axiosInstance.post('/api/users/', userForm.value);
        }
        // Reset form
        userForm.value = {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            user_type: '',
            password: '',
            date_of_birth: null,
        };
    } catch (err) {
        console.error('Error saving user:', err);
    }
};
</script>

<<template>
    <div v-if="!userData || userData.user_type !== 'admin'">
        <div class="w-full max-w-[980px] mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4 text-rose-600">Access Denied</h1>
            <p class="text-gray-700">You do not have permission to access this page.</p>
            <router-link to="/jobs" class="text-emerald-500 hover:underline">Apply Job here</router-link>
        </div>
    </div>

    <div v-else class="w-full max-w-[980px] mx-auto p-4">
        <!-- Tab Navigation -->
        <div class="flex space-x-4 mb-4 border-b">
            <button v-for="tabValue in ['institution', 'jobs', 'users']" :key="tabValue"
                @click="changeTab(tabValue as any)"
                class="px-4 py-2 font-medium text-gray-500 hover:text-emerald-600 border-b-2 border-transparent" :class="{
                    'text-emerald-600 border-emerald-500': currentTab === tabValue,
                    'hover:border-gray-300': currentTab !== tabValue
                }">
                {{ tabValue === 'institution' ? 'Institution' : tabValue.charAt(0).toUpperCase() + tabValue.slice(1) }}
            </button>
        </div>

        <!-- Tab Content -->
        <div class="bg-white shadow-md rounded-lg p-6">
            <div v-if="currentTab === 'institution'">
                <!-- Institution content (your existing form + table) -->
                <h2 class="text-xl font-bold mb-4">Institution Settings</h2>
                <p class="text-gray-600 mb-4">Manage institution details...</p>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-4">
                        <label for="name" class="block text-gray-700">Name</label>
                        <input type="text" id="name" v-model="form.name" placeholder="Enter institution name">
                    </div>
                    <div class="mb-4">
                        <label for="address" class="block text-gray-700">Address</label>
                        <input type="text" id="address" v-model="form.address" placeholder="Enter institution address">
                    </div>
                    <div class="mb-4">
                        <label for="phone" class="block text-gray-700">Contact Phone</label>
                        <input type="text" id="phone" v-model="form.phone_number"
                            placeholder="Enter contact phone number">
                    </div>
                    <div class="mb-4">
                        <label for="email" class="block text-gray-700">Contact Email</label>
                        <input type="email" id="email" v-model="form.email" placeholder="Enter contact email">
                    </div>
                    <div class="mb-4">
                        <label for="website" class="block text-gray-700">Website</label>
                        <input type="url" id="website" v-model="form.website" placeholder="Enter institution website">
                    </div>

                    <button type="submit" class="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">
                        Save Changes
                    </button>
                </form>

                <div class="mt-6">
                    <h3 class="text-gray-600 mb-4 text-lg">Institution List</h3>
                    <table class="w-full table-auto table rounded-md border border-emerald-500">
                        <thead class="bg-emerald-100 border rounded-md border-emerald-500">
                            <tr>
                                <th class="px-4 py-2  border border-emerald-500 text-left">Name</th>
                                <th class="px-4 py-2  border border-emerald-500 text-left">Address</th>
                                <th class="px-4 py-2  border border-emerald-500 text-left">Email</th>
                                <th class="px-4 py-2  border border-emerald-500 text-left">Phone</th>
                                <th class="px-4 py-2  border border-emerald-500 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-700">
                            <tr v-for="institution in institutions" :key="institution.id">
                                <td class="px-4 py-2 border border-emerald-500">{{ institution.name }}</td>
                                <td class="px-4 py-2 border border-emerald-500">{{ institution.address }}</td>
                                <td class="px-4 py-2 border border-emerald-500">{{ institution.email }}</td>
                                <td class="px-4 py-2 border border-emerald-500">{{ institution.phone_number }}</td>
                                <td class="px-4 py-2 border border-emerald-500 cursor-pointer hover:underline text-emerald-500 text-center"
                                    @click="() => selectedInstitution = institution">🖋️</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            <div v-else-if="currentTab === 'jobs'">
                <h2 class="text-xl font-bold mb-4">Job Settings</h2>
                <p>Coming soon...</p>
            </div>

            <div v-else-if="currentTab === 'users'">
                <h2 class="text-xl font-bold mb-4">User Management</h2>
                <form @submit.prevent="handleCreateUser">
                    <div class="mb-2">
                        <label for="name" class="block text-gray-700">First Name</label>
                        <input type="text" id="name" v-model="userForm.first_name" placeholder="Enter first name">
                    </div>
                    <div class="mb-2">
                        <label for="address" class="block text-gray-700">Last Name</label>
                        <input type="text" id="address" v-model="userForm.last_name" placeholder="Enter last name">
                    </div>
                    <div class="mb-2">
                        <label for="phone" class="block text-gray-700">Email</label>
                        <input type="text" id="phone" v-model="userForm.email" placeholder="Enter email">
                    </div>
                    <div class="mb-2">
                        <label for="email" class="block text-gray-700">Phome</label>
                        <input type="email" id="email" v-model="userForm.phone_number" placeholder="Enter phone number">
                    </div>
                    <div class="mb-2">
                        <label for="user_type" class="block text-gray-700">User type</label>
                        <select id="user_type" v-model="userForm.user_type" placeholder="Select user type">
                            <option v-for="userType in userTypeChoices" :selected="userType.value == 'applicant'"
                                :value="userType.value">{{ userType.name }}</option>
                        </select>
                    </div>
                    <div class="mb-2">
                        <label for="password" class="block text-gray-700">Password</label>
                        <input type="password" id="password" v-model="userForm.password"
                            placeholder="Enter phone number">
                    </div>
                    <button type="submit" class="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">
                        Save User
                    </button>
                </form>

                <!-- User list (you’ll need to fetch users separately) -->
                <div class="mt-6">
                    <h3 class="text-gray-600 mb-4 text-lg">User List</h3>
                    <!-- TODO: Fetch and display users -->
                </div>
            </div>
        </div>
    </div>
</template>

    <style scoped></style>