<script setup>
import Register from "./components/Register.vue";
import Toast from "primevue/toast";
import Header from "./components/Header.vue";
import {useUser} from "./composables/user-api.js";
import Feed from "./components/Feed.vue";
import CreatePost from "./components/CreatePost.vue";
import PostPage from "./components/PostPage.vue";

const {userIsAuthorized} = useUser();

</script>

<template>
  <div v-if="!userIsAuthorized">
    <Register/>
  </div>
  <div v-else>
    <Header/>
    <Feed/>
    <CreatePost/>
    <PostPage/>
  </div>
  <Toast/>
</template>

<style scoped>
</style>
