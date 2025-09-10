<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {Button} from "primevue";
import {usePosts} from "../composables/post-api";
import {useRouter} from "vue-router";

const {getPosts, posts} = usePosts();
const router = useRouter();

const noPosts = computed(() => posts.value.length === 0);

onMounted(async () => {
  await getPosts();
});

const goToCreatePost = () => {
  router.push({name: "create-post"});
};
</script>

<template>
  <section class="min-h-screen flex flex-col items-center justify-center px-4 gap-6">
    <!-- Header -->
    <div class="text-4xl font-bold text-gray-700 mb-12 text-center">
      Welcome to Poasts
    </div>

    <!-- No posts message -->
    <div v-if="noPosts" class="flex flex-col items-center gap-6">
      <p class="text-2xl font-semibold text-gray-600 text-center">
        No Poasts Yet :(
      </p>
      <p class=" text-2xl font-semibold text-gray-500 text-center">
        You should create one!
      </p>
      <Button
          class="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg"
          label="Create Post"
          @click="goToCreatePost"
      />
    </div>

    <!-- Posts grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-8 flex-col">
      <div v-for="post in posts" :key="post.id" class="p-4 border rounded-lg shadow hover:shadow-lg transition">
        <h2 class="font-semibold text-lg text-gray-800">{{ post.title }}</h2>
        <p class="text-gray-600 mt-2">{{ post.content }}</p>
      </div>
    </div>
  </section>
</template>


<style scoped>
</style>
