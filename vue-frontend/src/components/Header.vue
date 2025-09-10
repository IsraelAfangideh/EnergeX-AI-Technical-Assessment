<script lang="ts" setup>
import {Button} from "primevue";
import {useUser} from "../composables/user-api";
import {useRouter} from "vue-router";

const {logout} = useUser();
const router = useRouter()

const goToCreatePost = () => {
  router.push({name: 'create-post'})
};
const goToFeed = () => {
  router.push({name: 'feed'})
};
</script>

<template>
  <div class="absolute top-10 right-10 flex gap-4">
    <Button label="New Poast" severity="primary" @click="goToCreatePost"/>
    <Button label="Feed" severity="success" @click="goToFeed"/>
    <Button label="Logout" severity="danger" @click="logout"/>
  </div>
</template>

<style scoped>
</style>
