<script lang="ts" setup>
import {Button} from "primevue";
import {useUser} from "../composables/user-api";

const {logout} = useUser();

</script>

<template>
  <div class="flex flex-row absolute top-10 right-10">
    <Button label="Logout" severity="danger" @click="logout"/>
  </div>
</template>

<style scoped>

</style>