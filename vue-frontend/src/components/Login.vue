<script lang="ts" setup>
import {useUser} from "../composables/user-api";
import {computed, ref} from "vue";
import {useToast} from "primevue/usetoast";
import {Button, Divider, InputText, Password} from "primevue";
import {useRouter} from "vue-router";


const {login} = useUser();
const router = useRouter()
const toast = useToast();
const email = ref("");
const password = ref("");

const disableLogin = computed(() => !email.value || !password.value)

const onRegister = () => {
  router.push({path: "/register"})
}

const onLogin = async () => {
  try {
    await login(email.value, password.value)
    toast.add({
      severity: "success",
      summary: "Login Successful",
      detail: "Welcome back " + email.value,
      life: 3000,
    })
    await router.push({name: "feed"})
  } catch (err: any) {
    console.log(err)
    toast.add({
      severity: "error",
      summary: "Failed to Login",
      detail: "Failed to Login",
      life: 3000,
    })

  }

}
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
        <h1 class="text-3xl font-bold text-gray-800 text-center">Log In</h1>
        <div class="flex flex-col gap-4">
          <InputText v-model="email" class="w-full" placeholder="Email" type="email"/>
          <div>
            <Password v-model="password" fluid placeholder="Password" toggleMask/>
          </div>
        </div>
        <div>
          <Button :disabled="disableLogin"
                  class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  label="Login"
                  @click="onLogin"/>
          <Divider/>
          <div>
            Haven't registered yet?'
          </div>
          <Button
              class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              label="Register"
              @click="onRegister"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>