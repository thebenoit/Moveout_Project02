<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Logo from "./Logo.vue";

import MoveoutLogo from "../assets/images/Moveout_Logo2.svg";

import { TruckIcon } from "@heroicons/vue/24/outline";
import { UserIcon } from "@heroicons/vue/24/outline";
import utils from "../utils/utils/";
import BetaLogo from "./BetaLogo.vue";
import { WalletIcon } from "@heroicons/vue/24/outline"; // ajouter l'icône Wallet

const connecter = ref(false); // initialiser à false

const router = useRouter();

async function isUserLoggedIn() {
  try {
    const { isAuthenticated } = await utils.isLoggedInViaChat();
    connecter.value = isAuthenticated;
  } catch (error) {
    console.error("isUserLoggedIn error:", error);
    connecter.value = false;
  }
}

watch(
  () => router.path,
  async () => {
    await isUserLoggedIn();
  },
  { immediate: true }
);

onMounted(async () => {
  await isUserLoggedIn();
});

async function gotologout() {
  connecter.value = false;
  await utils.logout();
  router.go(0);
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

function estConnecter() {}
</script>

<style>
/* Base Navbar Styles */
.navbar {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  position: static;
  width: 100%;
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

/* Styles spécifiques pour les éléments */
.brand-text {
  white-space: nowrap;
}

.btn-text {
  white-space: nowrap;
}

.folder-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.folder-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

/* Gestion des débordements sur très petits écrans */
@media (max-width: 320px) {
  .brand-text {
    display: none;
  }

  .btn-text {
    font-size: 0.7rem;
  }

  .navbar-btn {
    padding: 0.25rem 0.375rem;
    min-height: 28px;
  }
}

/* Tablet Styles */
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

/* Mobile Styles */
@media (max-width: 640px) {
  .navbar {
    padding: 0.75rem 1rem;
    min-height: 60px;
  }

  .navbar-brand {
    font-size: 1rem;
    gap: 0.375rem;
  }

  .logo-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .navbar-buttons {
    gap: 0.375rem;
  }

  .navbar-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
    min-height: 40px;
  }

  /* Icône de dossier plus petite */
  .navbar-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .navbar {
    padding: 0.5rem 0.75rem;
    min-height: 56px;
  }

  .navbar-brand {
    font-size: 0.9rem;
    gap: 0.25rem;
  }

  .logo-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .navbar-buttons {
    gap: 0.25rem;
  }

  .navbar-btn {
    padding: 0.375rem 0.625rem;
    font-size: 0.8rem;
    min-height: 36px;
  }

  /* Icône de dossier encore plus petite */
  .navbar-btn svg {
    width: 1rem;
    height: 1rem;
  }
}

/* Extra Small Mobile Styles */
@media (max-width: 360px) {
  .navbar {
    padding: 0.5rem 0.5rem;
  }

  .navbar-brand {
    font-size: 0.85rem;
  }

  .navbar-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    min-height: 32px;
  }

  .navbar-buttons {
    gap: 0.125rem;
  }
}
</style>

<template>
  <nav class="navbar fixed-top">
    <!-- Brand Logo -->
    <a href="/" class="navbar-brand">
      <img src="/Moveout_Logo2.svg" alt="Moveout Logo" class="logo-icon" />
      <span class="brand-text">Moveout</span>
    </a>

    <!-- Navigation Buttons -->
    <div class="navbar-buttons">
      <button
        v-if="!connecter"
        @click="gotologin"
        class="navbar-btn navbar-btn-outline login-btn"
      >
        <span class="btn-text">Se connecter</span>
      </button>
      <button
        v-if="!connecter"
        @click="gotosignup"
        class="navbar-btn navbar-btn-solid signup-btn"
      >
        <span class="btn-text">S'inscrire</span>
      </button>

      <router-link
        v-if="connecter"
        to="/pricing"
        class="navbar-btn navbar-btn-outline folder-btn"
        aria-label="Accès Premium"
      >
        <WalletIcon class="w-6 h-6" />
      </router-link>
      <button
        v-if="connecter"
        @click="gotologout"
        class="navbar-btn navbar-btn-outline logout-btn"
      >
        <span class="btn-text">Déconnexion</span>
      </button>
    </div>
  </nav>
</template>
