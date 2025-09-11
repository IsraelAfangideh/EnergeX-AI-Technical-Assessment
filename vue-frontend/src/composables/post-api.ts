import {ref} from "vue";
import axios from "axios";
import {useUser} from "./user-api";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
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
const posts = ref<any>([]);

if (token.value) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
}

export function usePosts() {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const {logout} = useUser()

    const getPosts = async () => {
        try {
            const res = await api.get("/posts");

            posts.value = res.data;
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

    }

    const createPost = async (title: string, content: string) => {
        try {
            const res = await api.post("/posts", {title, content});
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
    }

    const getPostById = async (id: number) => {
        try {
            const res = await api.get(`/posts/${id}`);
            return res.data;
        } catch (err: any) {
            if (err.response?.status === 401) {
                logout()
            }
            error.value = err.response?.data?.message || "Something went wrong";
            throw err;
        } finally {
        }
    }
    return {
        getPosts,
        createPost,
        getPostById,
        posts,
        loading,
        error,
    };
}
