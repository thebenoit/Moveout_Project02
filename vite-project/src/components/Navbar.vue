<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from 'vue-router'
import Logo from "./Logo.vue";

import MoveoutLogo from "../assets/images/MoveoutLogo.svg";

import { TruckIcon } from '@heroicons/vue/24/outline'
import { UserIcon } from '@heroicons/vue/24/outline'
import utils from "@/utils/utils";

function logout() {
  utils.logout()
}


</script>

<template>

  
     
  <nav class="fixed w-full z-20 top-0 start-0 bg-opacity-60 bg-gray-600 backdrop-blur-xl text-white">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
      <ul class="flex flex-col p-4 md:p-0 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row">
  <li>
        <RouterLink to="/Demenagement" class="block py-2 px-3 text-white rounded hover:text-cyan-300 md:p-0">
          Demenagement   
          </RouterLink>
      </li>
      <li>
        <RouterLink to="/appartements" class="block py-2 px-3 text-white rounded hover:text-cyan-300 md:p-0">
          Appartements
          </RouterLink>
      </li>
      <li>
        <RouterLink to="/signup" class="block py-2 px-3 text-white rounded hover:text-cyan-300 md:p-0">
          Sign up
          </RouterLink>
      </li>
      <li>
        <RouterLink to="/login" class="block py-2 px-3 text-white rounded hover:text-cyan-300 md:p-0">
          Log in
          </RouterLink>
      </li> 
      <li>
        <RouterLink to="/contactus" class="block py-2 px-3 text-white rounded hover:text-cyan-300 md:p-0">
          Contact-us
          </RouterLink>
      </li>
      <li>
        <RouterLink to="/aboutus" class="block py-2 px-3 text-white rounded hover:text-cyan-300 md:p-0">
          About-us
          </RouterLink>
      </li>
      <li>
        <RouterLink to="/preferences" class="block py-2 px-3 text-white rounded hover:text-cyan-300 md:p-0">
          preferences
          </RouterLink>
      </li>
      <li>
        <RouterLink to="/settings" class="block py-2 px-3 text-white rounded hover:text-cyan-300 md:p-0">
          settings
          </RouterLink>
      </li>
      
      <li>
        <button class="block py-2 px-3 text-white rounded hover:text-cyan-300 md:p-0" @click="logout()">
          Logout
          </button>
      </li>
    </ul>
  
  </div>
</nav> 


</template>