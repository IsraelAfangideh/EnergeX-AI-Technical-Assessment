<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {Button} from "primevue";
import {usePosts} from "../composables/post-api";
import {useRouter} from "vue-router";

const {getPosts, posts} = usePosts();
const router = useRouter();

const noPosts = computed(() => posts.value.length === 0);


const goToCreatePost = () => {
  router.push({name: "create-post"});
};

const viewPost = (id: number) => {
  router.push({name: "view-post", params: {id}});
}

onMounted(async () => {
  await getPosts();
});
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
    <div v-else class="flex flex-col w-full max-w-3xl gap-6">
      <div
          v-for="post in posts"
          :key="post.id"
          class="p-6 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition-all duration-200"
          @click="viewPost(post.id)"
      >
        <h2 class="text-xl font-semibold text-gray-800">{{ post.title }}</h2>
        <p class="text-gray-600 mt-2 line-clamp-3">{{ post.content }}</p>
      </div>
    </div>
  </section>
</template>


<style scoped>
</style>
