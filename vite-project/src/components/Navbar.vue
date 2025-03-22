<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Logo from "./Logo.vue";

import MoveoutLogo from "../assets/images/Moveout_Logo2.svg";

import { TruckIcon } from "@heroicons/vue/24/outline";
import { UserIcon } from "@heroicons/vue/24/outline";
import utils from "@/utils/utils";
import BetaLogo from "./BetaLogo.vue";

const connecter = ref(false);

const router = useRouter();

function logout() {
  utils.logout();
  router.push({ path: "/login" });
}

function login() {
  router.push({ path: "/login" });
}

function signup() {
  router.push({ path: "/signup" });
}

const customerPortalUrl = ref(
  `https://billing.stripe.com/p/login/00g033aRe1av8es3cc` +
    "?prefilled_email=" 

);

function billing() {
  router.push({
    path: "https://billing.stripe.com/p/login/test_8wMeWWb968B3cFO144",
  });
}

function estConnecter() {
  if (utils.getToken()) {
    console.log("est connecté");
    connecter.value = true;
  } else {
    console.log(`n'est pas  connecté`);
    connecter.value = false;
  }
}
</script>

<style>
  /* Base Navbar Styles */
  .navbar {
    padding: 0.5rem 1rem; /* Consistent padding for navbar */
    display: flex;
    justify-content: center; /* Center content horizontally */
    align-items: center;
  }

  .container-fluid {
    margin: 0 15rem;
  }

  .navbar-brand img {
    width: 50px;
    height: 50px;
  }

  .navbar-item-btn {
    padding: 0.4rem 1.6rem;
    border-radius: 10px;
    font-size: medium;
    transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth hover effects */
  }

  .navbar-item-btn-colored {
    padding: 0.4rem 1.8rem;
    border-radius: 10px;
    font-size: medium;
    background-color: rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth hover effects */
  }

  .navbar-item-btn:hover,
  .navbar-item-btn:focus {
    background-color: rgba(0, 0, 0, 0.3);
    transform: scale(1.05); /* Slight scale effect on hover */
  }

  .navbar-item-btn-colored:hover,
  .navbar-item-btn-colored:focus {
    background-color: rgba(0, 0, 0, 0.3);
    transform: scale(1.05); /* Slight scale effect on hover */
  }

  /* Mobile Styles */
  /* Mobile Styles */
  @media (max-width: 768px) {
    .navbar {
      padding: 0.5rem;
    }

    .container-fluid {
      margin: 0;
    }

    .navbar-nav.ms-auto {
      margin-left: 0 !important; /* Override Bootstrap's ms-auto */
    }

    .navbar-collapse {
      background-color: #f8f9fa; /* Light background for mobile menu */
      border-radius: 10px;
      margin-top: 0.5rem;
    }

    .navbar-item-btn,
    .navbar-item-btn-colored {
      padding: 0.5rem 1rem;
      width: 100%; /* Full width for better tap targets */
      text-align: center;
      border: 1px solid rgba(0, 0, 0, 0.2);
      font-size: 0.9rem;
    }

    .navbar-item-btn:hover,
    .navbar-item-btn:focus,
    .navbar-item-btn-colored:hover,
    .navbar-item-btn-colored:focus {
      transform: scale(1.02);
    }
  }
  @media (min-width: 800px) {
    .container-fluid {
      margin: 0 5rem;
    }
  }
  @media (min-width: 1200px) {
    .container-fluid {
      margin: 0 10rem;
    }
  }
  @media (min-width: 1400px) {
    .container-fluid {
      margin: 0 15rem;
    }
  }
</style>

<template>
  <nav class="navbar navbar-expand-md bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <!-- Brand Logo -->
      <a class="navbar-brand mr-4" href="/">
        <img src="../assets/images/Moveout_Logo2.svg" alt="Moveout Logo">
      </a>

      <!-- Toggler Button for Mobile -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item m-2">
            <button v-if="!utils.getToken()" @click="login" class="navbar-item-btn">Log In</button>
          </li>

          <li class="nav-item m-2">
            <button v-if="!utils.getToken()" @click="signup" class="navbar-item-btn-colored">Sign Up</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>


  <!-- <div>     -->
    <!-- <div class="navbar bg-white fixed top-0 z-50 font-normal py-4 px-10 hidden sm:flex">
      <div class="flex-1">
        <a href="/" class="flex items-center space-x-1 rtl:space-x-reverse">
          <img
            src="../assets/images/Moveout_Logo2.svg"
            alt="Moveout Logo"
            class="h-12 w-auto"
          />
          <span class="self-center whitespace-nowrap dark:text-white text-2xl">Moveout</span>
        </a>

        <div
          class="tooltip tooltip-bottom"
          data-tip="Moveout.ai est en mode BETA"
        >
          <button>
            <BetaLogo class="ml-2 mt-2" />
          </button>
        </div>
      </div>
      <div class="flex-none">
        <div class="flex-none">
          <div class="dropdown dropdown-end"> -->
            <!-- Si l'utilisateur n'est pas connecté, affiche "login" -->
            <!-- <button
              v-if="!utils.getToken()"
              @click="login"
              class="bg-white text-gray-500 py-3 px-6 rounded-[10px] text-md md:text-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Log In
            </button>

            <button
              v-else @click="logout" class="bg-white text-gray-500 py-3 px-6 rounded-[10px] text-md md:text-md font-semibold hover:bg-gray-300 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="navbar bg-base-100 fixed top-0 z-50 font-normal p-4 sm:hidden flex justify-between"
    >
      <div>
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="../assets/images/Moveout_Logo2.svg"
            alt="Moveout Logo"
            class="h-12 w-auto"
          />
        </a>
      </div>
      <div
        class="tooltip-bottom"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Moveout.ai est en mode BETA"
      >
        <button>
          <BetaLogo class="ml-2 mt-2" />
        </button>
      </div>
      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-square btn-ghost">
            <div class="w-10 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-5 w-5 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </div>
          </div>
          <ul
            v-if="!utils.getToken()"
            tabindex="0"
            class="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
           
            <li><a href="/listings">Listings</a></li>
            <li >
              <RouterLink to="/login" class=""> Log In </RouterLink>
            </li>
          </ul>
          <ul 
          v-else
          tabindex="0"
          class="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li ><a @click="logout">Logout</a></li>
            <li >
              <a :href="customerPortalUrl" target="_blank">Billing</a>
            </li>
          </ul>
        </div>
      </div>
    </div>  -->
  <!-- </div> -->


  
</template>
