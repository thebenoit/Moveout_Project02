import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Appartements from '@/views/Appartements.vue'
import Demenagement from '@/views/Demenagement.vue'
import AboutUs from '@/views/AboutUs.vue'
import ContactUs from '@/views/ContactUs.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Foryou from '@/views/foryou.vue'
import Preferences from '@/views/PreferenceSurvey/Preferences.vue'
import Settings from '@/views/Settings.vue'
import LandingPage from '@/views/landingPages/landingPage.vue'
import LandingPageSignup from '@/views/landingPages/landingPage-signup.vue'
import LandingPageSuccess from '@/views/landingPages/landingPage-success.vue'
import Erreur404 from '@/views/Erreur404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/appartements',
      name: 'appartements',
      component: Appartements
    },
    {
      path: '/demenagement',
      name: 'demenagement',
      component: Demenagement
    },
    {
      path: '/aboutus',
      name: 'about-us',
      component: AboutUs
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/contactus',
      name: 'contact-us',
      component: ContactUs
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/foryou',
      name: 'foryou',
      component: Foryou
    },
    {
      path: '/preferences',
      name: 'preferences',
      component: Preferences
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/landingpage',
      name: 'landing-page',
      component: LandingPage
    },
    {
      path: '/landingpage-success',
      name: 'landing-page-success',
      component: LandingPageSuccess
    },
    {
      path: '/landingpage-signup',
      name: 'landing-page-signup',
      component: LandingPageSignup
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'erreur404',
      component: Erreur404
    }
  ]
})

export default router
