import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Appartements from '../views/Appartements.vue'
import Demenagement from '../views/Demenagement.vue'



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
    
  ]
})

export default router
