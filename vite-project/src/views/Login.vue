<script setup lang="ts">
import { useRouter } from "vue-router";
import utils from "../utils/utils.js";

const router = useRouter();

const versSignup = () => {
  router.push({ path: "/signup" });
};

const loginWithGoogle = () => {
  utils.loginWithGoogle();
};
</script>

<style>
/* Page Container */
.page-container {
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
}

/* Top Navigation Bar */
.top-navbar {
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
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

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.login-card {
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  animation: fadeInUp 0.6s ease-out;
  border: 1px solid #eee;
  border-radius: 12px;
}

/* Form Header */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}

/* Google Button */
.google-button {
  width: 100%;
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
}

.google-button:hover {
  background: #fafafa;
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* Animation */
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

/* Responsive */
@media (max-width: 768px) {
  .top-navbar {
    padding: 0.75rem 1rem;
  }

  .navbar-brand {
    font-size: 1.125rem;
  }

  .logo-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .main-content {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .top-navbar {
    padding: 0.5rem 1rem;
  }

  .navbar-brand {
    font-size: 1rem;
  }

  .logo-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .login-card {
    padding: 1.5rem 1rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .login-subtitle {
    font-size: 0.9rem;
  }
}
</style>

<template>
  <div class="page-container">
    <!-- Top Navigation Bar -->
    <nav class="top-navbar">
      <a href="/" class="navbar-brand">
        <img src="/Moveout_Logo2.svg" alt="Moveout Logo" class="logo-icon" />
        <span>Moveout</span>
      </a>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <div class="login-card">
        <!-- Header -->
        <div class="login-header">
          <h1 class="login-title">Bienvenue sur MoveoutAI</h1>
          <p class="login-subtitle">Connectez-vous simplement avec Google</p>
        </div>

        <!-- Google Sign-In Button -->
        <button class="google-button" @click="loginWithGoogle">
          <div class="google-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          Se connecter avec Google
        </button>
      </div>
    </div>
  </div>
</template>
