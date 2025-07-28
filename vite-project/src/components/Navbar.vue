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

function gotologout() {
  utils.logout();
  router.push({ path: "/login" });
}

function gotologin() {
  router.push({ path: "/login" });
}

function gotosignup() {
  router.push({ path: "/signup" });
}

const customerPortalUrl = ref(
  `https://billing.stripe.com/p/login/00g033aRe1av8es3cc` + "?prefilled_email="
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
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: black;
  text-decoration: none;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

.navbar-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.navbar-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.navbar-btn-outline {
  background-color: white;
  color: black;
  border: 1px solid #d1d5db;
}

.navbar-btn-outline:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.navbar-btn-solid {
  background-color: black;
  color: white;
}

.navbar-btn-solid:hover {
  background-color: #374151;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .navbar {
    padding: 0.75rem 1rem;
  }

  .navbar-brand {
    font-size: 1.125rem;
  }

  .logo-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .navbar-buttons {
    gap: 0.5rem;
  }

  .navbar-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0.5rem 0.75rem;
  }

  .navbar-brand {
    font-size: 1rem;
  }

  .logo-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .navbar-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>

<template>
  <nav class="navbar fixed-top">
    <!-- Brand Logo -->
    <a href="/" class="navbar-brand">
      <img src="/Moveout_Logo2.svg" alt="Moveout Logo" class="logo-icon" />
      <span>Moveout</span>
    </a>

    <!-- Navigation Buttons -->
    <div class="navbar-buttons">
      <button
        v-if="!utils.getToken()"
        @click="gotologin"
        class="navbar-btn navbar-btn-outline"
      >
        Se connecter
      </button>
      <button
        v-else
        @click="router.push('/foryou')"
        class="navbar-btn navbar-btn-solid"
      >
        Compte
      </button>

      <button
        v-if="!utils.getToken()"
        @click="gotosignup"
        class="navbar-btn navbar-btn-solid"
      >
        Commencer
      </button>
      <button v-else @click="gotologout" class="navbar-btn navbar-btn-outline">
        Déconnexion
      </button>
    </div>
  </nav>
</template>
