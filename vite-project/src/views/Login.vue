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
  /* General Styles */
  .login-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }

  .login-content {
    width: 100%;
    max-width: 450px;
    padding: 1rem;
  }

  .login-card {
    background-color: #ffffff;
    padding: 2.5rem 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: center;
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .login-title {
    font-weight: 700;
    font-size: 1.8rem;
    color: #333333;
    margin-bottom: 0.5rem;
    animation: fadeIn 1s ease-out 0.2s;
    animation-fill-mode: both;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .login-description {
    font-size: 1rem;
    color: #666666;
    margin-bottom: 2rem;
    animation: fadeIn 1s ease-out 0.4s;
    animation-fill-mode: both;
  }

  .input-group {
    margin-bottom: 1.5rem;
    animation: slideInLeft 0.8s ease-out 0.6s;
    animation-fill-mode: both;
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .input-group input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #dddddd;
    border-radius: 8px;
    font-size: 1rem;
    color: #333333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .input-group input:focus {
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    outline: none;
  }

  .login-btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    background-color: #333333;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    animation: fadeIn 1s ease-out 0.8s;
    animation-fill-mode: both;
  }

  .login-btn:hover, .login-btn:focus {
    background-color: #666666;
    transform: scale(1.02);
  }

  .login-btn:active {
    transform: scale(0.98);
  }

  .login-small {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666666;
    animation: fadeIn 1s ease-out 1s;
    animation-fill-mode: both;
  }

  .login-link {
    color: rgba(0, 0, 0, 0.5);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .login-link:hover {
    color: rgba(0, 0, 0, 0.7);
    text-decoration: underline;
  }

  .error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    animation: shake 0.5s ease-out;
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-10px);
    }
    50% {
      transform: translateX(10px);
    }
    75% {
      transform: translateX(-10px);
    }
  }
</style>

<template>
  <section class="login-section">
    <div class="login-content">
      <div class="login-card">
        <!-- Error Message -->
        <p class="error-message">{{ messageErreur }}</p>

        <!-- Title and Description -->
        <h1 class="login-title">Bienvenue !</h1>
        <p class="login-description">Connectez-vous à votre compte.</p>

        <!-- Email Input -->
        <div class="input-group">
          <input
            id="email"
            class="form-control"
            type="text"
            placeholder="Email ou Tel"
            v-model="identifier"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="input-group">
          <input
            id="password"
            class="form-control"
            type="password"
            placeholder="Password"
            v-model="password"
            required
          />
        </div>

        <!-- Login Button -->
        <button class="login-btn" type="submit" @click="login">Se connecter</button>

        <!-- Signup Link -->
        <p class="login-small">
          Vous n'avez pas de compte ? <a href="/signup" class="login-link">Inscrivez-vous</a>
        </p>
      </div>
    </div>
  </section>


  <!-- <div class="w-full min-h-screen grid lg:grid-cols-2 ">
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
  </div> -->
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