<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {usePosts} from "../composables/post-api";

const {getPosts, posts} = usePosts();

const noPosts = computed(() => posts.value.length === 0)

onMounted(async () => {
  await getPosts();
})
</script>

<template>
  <div v-if="noPosts" class="text-center text-2xl font-bold text-gray-600">
    No Poasts Yet :( You Should Create One!
  </div>
  {{ posts.value }}
</template>

<style scoped>

</style>