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

<template>
  <div>
    <div
      class="navbar bg-white fixed top-0 z-50 font-normal py-4 px-10 hidden sm:flex"
    >
      <div class="flex-1">
        <a href="/" class="flex items-center space-x-1 rtl:space-x-reverse">
          <img
            src="../assets/images/Moveout_Logo2.svg"
            alt="Moveout Logo"
            class="h-12 w-auto"
          />
          <span class="self-center whitespace-nowrap dark:text-white text-2xl"
            >Moveout</span
          >
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
          <div class="dropdown dropdown-end">
            <!-- <div
              tabindex="0"
              role="button"
              class="btn btn-square bg-white border-none"
            >
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
            </div> -->
            <!-- Si l'utilisateur n'est pas connecté, affiche "login" -->
            
            <button
              v-if="!utils.getToken()"
              @click="login"
              class="bg-white text-gray-500 py-3 px-6 rounded-[10px] text-md md:text-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Log In
            </button>

            <button
              v-else
              @click="logout"
              class="bg-white text-gray-500 py-3 px-6 rounded-[10px] text-md md:text-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
            <!-- <ul
              v-if="!utils.getToken()"
              tabindex="0"
              class="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <RouterLink to="/login" class=""> Log in </RouterLink>
              </li>
            </ul> -->
            <!-- Sinon, affiche "signup" -->
            <!-- <ul
              v-else
              tabindex="0"
              class="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li><a @click="logout">Logout</a></li>
              <li>
                <a :href="customerPortalUrl" target="_blank">Billing</a>
              </li>
            </ul> -->
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
          <!-- <span class="self-center whitespace-nowrap dark:text-white text-2xl">Moveout</span> -->
        </a>
      </div>
      <div
        class="tooltip tooltip-bottom"
        data-tip="Moveout.ai est en mode BETA"
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
    </div>
  </div>
</template>
