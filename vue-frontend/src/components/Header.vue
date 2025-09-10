<script lang="ts" setup>
import {Button} from "primevue";
import {useUser} from "../composables/user-api";

const {logout} = useUser();

</script>

<template>
  <div class="flex flex-row absolute top-0 right-0">
    <Button label="Logout" severity="danger" @click="logout"/>
  </div>
</template>

<style scoped>

</style>