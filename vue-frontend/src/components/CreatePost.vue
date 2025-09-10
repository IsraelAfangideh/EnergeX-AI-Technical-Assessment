<script lang="ts" setup>
import {computed, ref} from "vue";
import {Button, InputText, Textarea} from "primevue";
import {useRouter} from "vue-router";
import {usePosts} from "../composables/post-api";
import {useToast} from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
const {createPost} = usePosts();

const title = ref("");
const content = ref("");

const disableSubmit = computed(() => !title.value || !content.value);

const onSubmit = async () => {
  try {
    await createPost(title.value, content.value);
    toast.add({
      severity: "success",
      summary: "Post Created",
      detail: `Your post "${title.value}" was successfully created!`,
      life: 3000,
    });
    router.push({name: "feed"});
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Failed to Create Post",
      detail: err?.response?.data?.message || "Something went wrong 😬",
      life: 4000,
    });
  }
};

const onCancel = () => {
  router.push({name: "feed"});
};
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-3xl bg-white p-12 rounded-2xl shadow-lg flex flex-col gap-6">
      <div class="text-4xl font-bold text-gray-800 text-center mb-8">
        Create a New Post
      </div>

      <div class="flex flex-col gap-6">
        <InputText
            v-model="title"
            class="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Post Title"
        />

        <Textarea
            v-model="content"
            autoResize
            class="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="What's on your mind?"
            rows="10"
        />
      </div>

      <div class="flex flex-col md:flex-row justify-between gap-4 mt-8">
        <Button
            class="w-full md:w-auto flex-1 py-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            label="Cancel"
            severity="danger"
            @click="onCancel"
        />
        <Button
            :disabled="disableSubmit"
            class="w-full md:w-auto flex-1 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            label="Create Post"
            @click="onSubmit"
        />

      </div>
    </div>
  </section>
</template>

<style scoped>

</style>