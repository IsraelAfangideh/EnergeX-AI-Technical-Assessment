<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {usePosts} from "../composables/post-api";
import {Button} from "primevue";

const router = useRouter();
const route = useRoute();
const {getPostById} = usePosts();

const post = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const id = route.params.id;
  if (!id) {
    error.value = "Post ID not found";
    loading.value = false;
    return;
  }

  try {
    post.value = await getPostById(Number(id));
  } catch (err: any) {
    error.value = err.message || "Failed to load post";
  } finally {
    loading.value = false;
  }
});

const goBack = () => router.push({name: "feed"});
</script>

<template>
  <section class="min-h-screen px-4 py-8 flex flex-col items-center gap-6">
    <Button class="self-start absolute top-10 left-10 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg px-4 py-2"
            label="Back"
            @click="goBack"/>

    <div v-if="loading" class="text-gray-500 text-lg">Loading post...</div>
    <div v-else-if="error" class="text-red-500 text-lg">{{ error }}</div>
    <div v-else class="w-full max-w-3xl bg-white p-8 rounded-xl shadow">
      <h1 class="text-3xl font-bold text-gray-800">{{ post.title }}</h1>
      <div class="text-gray-500 text-sm mt-2 mb-6">
        Posted by {{ post.author?.name || 'Unknown' }} on {{ new Date(post.created_at).toLocaleString() }}
      </div>
      <p class="text-gray-700 text-lg whitespace-pre-line">{{ post.content }}</p>
    </div>
  </section>
</template>

<style scoped>
p {
  line-height: 1.6;
}
</style>
