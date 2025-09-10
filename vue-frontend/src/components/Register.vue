<script lang="ts" setup>
import {computed, ref} from "vue";
import {Button, InputText, Password} from "primevue";
import {useUser} from "../composables/user-api";

const {register} = useUser();
const name = ref("");
const email = ref("");
const password = ref("");

const disableSubmit = computed(() => !name.value || !email.value || !password.value)

const onSubmit = () => register(name.value, email.value, password.value)

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full">
    <!-- Left side with image -->
    <div class="hidden md:flex items-center justify-center bg-gray-100">
      <img
          alt="Registration illustration"
          class="object-cover w-full h-full"
          src="../assets/vue.svg"
      />
    </div>

    <!-- Right side with form -->
    <div class="flex items-center justify-center bg-white">
      <div class="w-full max-w-md gap-4">
        <h1 class="text-3xl font-bold text-gray-800 text-center">Create Account</h1>
        <div class="flex flex-col gap-4">
          <InputText v-model="name" class="w-full" placeholder="Full Name"/>
          <InputText v-model="email" class="w-full" placeholder="Email" type="email"/>
          <Password v-model="password" placeholder="Password" toggleMask/>
        </div>
        <div>
          <Button :disabled="disableSubmit"
                  class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  label="Register"
                  @click="onSubmit"/>
        </div>
      </div>
    </div>
  </div>
</template>
