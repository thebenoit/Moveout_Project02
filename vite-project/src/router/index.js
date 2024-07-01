import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Appartements from '@/views/Appartements.vue';
import Demenagement from '@/views/Demenagement.vue';
import AboutUs from '@/views/AboutUs.vue';
import ContactUs from '@/views/ContactUs.vue';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import Foryou from '@/views/foryou.vue';


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
      name: 'Demenagement',
      component: Demenagement
    },

    {
      path: '/aboutus',
      name: 'About-us',
      component: AboutUs
    },
    
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/contactus',
      name: 'Contact-us',
      component: ContactUs
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/foryou',
      name: 'Foryou',
      component: Foryou
    },
  ]
})

export default router
