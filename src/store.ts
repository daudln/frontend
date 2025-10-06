import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import api from './api'

export const useUserStore = defineStore('user', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const refreshToken = ref(localStorage.getItem('refreshToken') || null)
    const isAuthenticated = computed(() => !!token.value)

    // Automatically persist tokens
    watch(token, val => {
        if (val) localStorage.setItem('token', val)
        else localStorage.removeItem('token')
    })
    watch(refreshToken, val => {
        if (val) localStorage.setItem('refreshToken', val)
        else localStorage.removeItem('refreshToken')
    })

    // Login
    const login = async (username: string, password: string) => {
        const { data } = await api.post('/token/', { username, password })
        token.value = data.access
        refreshToken.value = data.refresh
        await fetchProfile()
    }

    // Fetch user profile
    const fetchProfile = async () => {
        const { data } = await api.get('/user/profile/')
        user.value = data
    }

    // Logout
    const logout = () => {
        user.value = null
        token.value = null
        refreshToken.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
    }

    // Auto refresh tokens
    const refreshAccessToken = async () => {
        if (!refreshToken.value) return logout()
        try {
            const { data } = await api.post('/token/refresh/', { refresh: refreshToken.value })
            token.value = data.access
        } catch {
            logout()
        }
    }

    // Attach token to requests
    api.interceptors.request.use(config => {
        if (token.value) {
            config.headers.Authorization = `Bearer ${token.value}`
        }
        return config
    })

    // Handle expired tokens
    api.interceptors.response.use(
        res => res,
        async err => {
            if (err.response?.status === 401 && refreshToken.value) {
                await refreshAccessToken()
                err.config.headers.Authorization = `Bearer ${token.value}`
                return api.request(err.config)
            }
            return Promise.reject(err)
        }
    )

    return {
        user,
        token,
        refreshToken,
        isAuthenticated,
        login,
        fetchProfile,
        logout,
        refreshAccessToken
    }
})
