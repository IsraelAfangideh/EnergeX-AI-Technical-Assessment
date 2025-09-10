<script setup>
import Toast from "primevue/toast";
import Header from "./components/Header.vue";
import {useUser} from "./composables/user-api";

const {userIsAuthorized} = useUser();
</script>

<template>
  <Header v-if="userIsAuthorized"/>
  <Toast/>
  <router-view/>
</template>

<style scoped>
</style>
