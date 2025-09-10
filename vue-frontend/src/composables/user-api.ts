import {computed, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});


const token = ref<string | null>(localStorage.getItem("token"));
const user = ref<any>(null);


const userIsAuthorized = computed(() => token.value !== null)

if (token.value) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
}

export function useUser() {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const router = useRouter()

    const register = async (name: string, email: string, password: string) => {
        loading.value = true;
        error.value = null;

        try {
            const res = await api.post("/register", {name, email, password});

            token.value = res.data.token;
            user.value = res.data.user || null;

            if (token.value) {
                localStorage.setItem("token", token.value);
            }
            api.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

            return res.data;
        } catch (err: any) {
            if (err.response?.status === 401) {
                logout()
            }
            error.value = err.response?.data?.message || "Something went wrong";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const login = async (email: string, password: string) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.post("/login", {email, password});
            token.value = res.data.token;
            user.value = res.data.user || null;
            if (token.value) {
                localStorage.setItem("token", token.value);
            }
            api.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
            return res.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || "Something went wrong";
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        router.push({path: "/"})
    };

    return {
        register,
        login,
        logout,
        userIsAuthorized,
        user,
        loading,
        error,
    };
}
