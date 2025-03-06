<script setup lang="ts">
import { ref } from 'vue'
//import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
//import { Input } from '@/components/ui/input'
//import { Label } from '@/components/ui/label'
import utils from '../utils/utils'
import { useRouter } from 'vue-router'
import { errorMessages } from 'vue/compiler-sfc';


const identifier = ref("")
const password = ref("")
const messageErreur = ref("")

const router = useRouter()

async function login(){

  try {
  console.log('identifier: ', identifier.value)
  console.log('password: ', password.value)
  let result = await utils.post('api/client/login',
    {
      "identifier": identifier.value,
      "password": password.value 
    }
  )
  //si il y a une erreur rentre dans la variable  pour afficher à l'user
  if(result.error){
    console.log('resultError; ', result.error.message);
    messageErreur.value = result.error.message
  }

  console.log('result; ', result);
  //result = await result.json()
  console.log(result.token)

  if(result.token){
    console.log('pass ici?????')
    utils.setToken(result.token)
    router.push({ 
        path: '/foryou',
        query: { refresh: Date.now() }
      });
  }

  }catch(error){
    console.log("erreur lors du login: ", error)
  }


}

</script>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInImage {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-fadeIn {
    animation: fadeIn 1s ease-in-out;
  }

  .animate-fadeInImage {
    animation: fadeInImage 1.5s ease-in-out;
  }
</style>

<template>
  <div class="w-full min-h-screen grid lg:grid-cols-2 ">
    <div class="mx-auto max-w-sm content-center w-full">
      <Card class="bg-gray-200 text-center backdrop-blur-3xl mt-16 lg:mt-0 m-5 sm:m-0 animate-fadeIn transition-all duration-500 ease-in-out">
        <CardHeader>
          <p class="text-red-500 m-2 ">{{messageErreur}}</p>
          <CardTitle class="text-xl">
            Log In
          </CardTitle>
          <CardDescription>
            Remplissez ce Formulaire pour vous Connecter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid mt-1 ">
              <input class="rounded-md text-center p-3 transition-transform duration-300 ease-in-out transform focus:scale-105" id="email" placeholder="Email ou Tel" v-model="identifier" required />
            </div>
            <div class="grid mt-1">
              <input class="rounded-md text-center p-3 transition-transform duration-300 ease-in-out transform focus:scale-105" id="password" type="password" placeholder="mot de passe" v-model="password" required />
            </div>
            <button  type="submit" class="bg-blue-main text-white py-3 px-6 rounded-full text-lg md:text-lg font-semibold hover:bg-blue-400 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300" @click="login">
              Log In
            </button>
          </div>
          <div class="mt-4 text-center text-sm">
            Vous n'avez pas de compte?
            <a href="/signup" class="underline text-blue-main">
              Inscrivez-vous
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="hidden bg-muted lg:block">
      <img src="@/assets/images/house-1477041_1920.jpg" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale animate-fadeInImage">
    </div>
  </div>
</template>

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