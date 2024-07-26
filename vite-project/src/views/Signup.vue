<script setup >
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import utils from '../utils/utils'
import { useRouter } from 'vue-router'

const firstName = ref("")
const lastName = ref("")
const phone = ref("")
const email = ref("")
const confirmEmail = ref("")
const password = ref("")
const confirmPassword = ref("")

const router = useRouter()


async function signup(){
  let result = await utils.post('api/client/signup',
    {
      "firstName": firstName.value,
      "lastName": lastName.value,
      "phone": phone.value,
      "email": email.value,
      "confirmEmail": confirmEmail.value,
      "password": password.value,
      "confirmPassword": confirmPassword.value
    }
  )


  result = await result.json()
  console.log(result.token)

  if(result.token){
    utils.setToken(result.token)
    router.push({ path: '/foryou' })
  }

}

</script>

<template>
  <div class="w-full min-h-screen grid lg:grid-cols-2 ">
    <div class="mx-auto max-w-sm content-center">
      <Card class="bg-gray-200 backdrop-blur-3xl mt-16 lg:mt-0 ">
        <CardHeader>
          <CardTitle class="text-xl">
            Sign Up
          </CardTitle>
          <CardDescription>
            Fill the form below to get you started !
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Input id="first-name" placeholder="First name" required  v-model="firstName"/>
              </div>
              <div class="grid gap-2">
                <Input id="last-name" placeholder="Last name" required  v-model="lastName"/>
              </div>
            </div>
            <div class="grid mt-1">
              <Input id="phone" type="phone" placeholder="Phone number" required  v-model="phone"/>
            </div>
            <div class="grid mt-1">
              <Input id="email" type="email" placeholder="Email" required  v-model="email"/>
            </div>
            <div class="grid mt-1">
              <Input id="email" type="email" placeholder="Confirm email" required  v-model="confirmEmail"/>
            </div>
            <div class="grid mt-1">
              <Input id="password" type="password" placeholder="Password" v-model="password"/>
            </div>
            <div class="grid mt-1">
              <Input id="password" type="password" placeholder="Confirm Password" v-model="confirmPassword"/>
            </div>
            <Button type="submit" class="w-full bg-cyan-500" @click="signup">
              Create an account
            </Button>
          </div>
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <a href="/Login" class="underline">
              Log in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="hidden bg-muted lg:block">
      <img src="@/assets/images/house-1477041_1920.jpg" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale">
    </div>
  </div>
</template>