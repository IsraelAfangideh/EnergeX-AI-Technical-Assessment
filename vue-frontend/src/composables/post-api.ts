import {ref} from "vue";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

const token = ref<string | null>(localStorage.getItem("token"));
const posts = ref<any>([]);

if (token.value) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
}

export function usePosts() {
    const loading = ref(false);
    const error = ref<string | null>(null);

    const getPosts = async () => {
        try {
            const res = await api.get("/posts");

            posts.value = res.data;
            return res.data;

        } catch (err: any) {
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
            error.value = err.response?.data?.message || "Something went wrong";
            throw err;
        } finally {
            loading.value = false;
        }
    }
    return {
        getPosts,
        createPost,
        posts,
        loading,
        error,
    };
}
