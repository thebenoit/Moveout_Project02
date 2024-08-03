<script setup lang="ts">
import { ref } from 'vue'
//import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
//import { Input } from '@/components/ui/input'
//import { Label } from '@/components/ui/label'
import utils from '../utils/utils'
import { useRouter } from 'vue-router'


const identifier = ref("")
const password = ref("")

const router = useRouter()

async function login(){
  console.log('identifier: ', identifier.value)
  console.log('password: ', password.value)
  let result = await utils.post('api/client/login',
    {
      "identifier": identifier.value,
      "password": password.value 
    }
  )
  console.log('result; ', result);
  //result = await result.json()
  console.log(result.token)

  if(result.token){
    utils.setToken(result.token)
    router.push({ path: '/foryou' })
  }

}

</script>

<template>
  <div class="w-full min-h-screen grid lg:grid-cols-2 ">
    <div class="mx-auto max-w-sm content-center w-full">
      <Card class="bg-gray-200 backdrop-blur-3xl mt-16 lg:mt-0">
        <CardHeader>
          <CardTitle class="text-xl">
            Login
          </CardTitle>
          <CardDescription>
            Fill the form below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <!-- <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Input id="first-name" placeholder="First name" required />
              </div>
              <div class="grid gap-2">
                <Input id="last-name" placeholder="Last name" required />
              </div>
            </div>  
            <div class="grid mt-1">
              <Input id="phone" type="phone" placeholder="Phone number" required />
            </div> -->
            <div class="grid mt-1">
              <input id="email" placeholder="Email or Phone Number" v-model="identifier" required />
            </div>
            <div class="grid mt-1">
              <input id="password" type="password" placeholder="Password" v-model="password" required />
            </div>
            <Button type="submit" class="w-full bg-cyan-500" @click="login">
              Log in
            </Button>
          </div>
          <div class="mt-4 text-center text-sm">
            Don't have an account?
            <a href="/signup" class="underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
      <!-- <div class="card w-96 shadow-xl bg-gray-300 p-8 items-center">
        <div class="text-2xl">
          Login
        </div>
        <div class="text-s">
          Fill the form below to get you started !
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4 w-full">
            <input type="text" placeholder="First name" class="input input-bordered w-full max-w-xs" />
            <input type="text" placeholder="Last name" class="input input-bordered w-full max-w-xs" />
          </div>
          <input type="text" placeholder="Phone number" class="input input-bordered w-full max-w-xs" />
          <input type="text" placeholder="Email/Phone" class="input input-bordered w-full max-w-xs" />
          <input type="text" placeholder="Password" class="input input-bordered w-full max-w-xs" />
        </div>
      </div> -->
    </div>
    <div class="hidden bg-muted lg:block">
      <img src="@/assets/images/house-1477041_1920.jpg" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale">
    </div>
  </div>
</template>