import { createRouter, createWebHistory } from "vue-router";

import HomeNew from "@/views/HomeNew.vue";

import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";

import Erreur404 from "@/views/Erreur404.vue";

import Pricing_Page from "@/views/pricing_pages/pricing_page.vue";
import PremiumSuccess from "@/views/pricing_pages/PremiumSuccess.vue";
import TestListingCard from "@/views/TestListingCard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeNew,
    },
    // {
    //   path: "/chat",
    //   name: "chat",
    //   component: ChatHome,
    // },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    // {
    //   path: "/foryou",
    //   name: "foryou",
    //   component: Foryou,
    // },
    {
      path: "/pricing",
      name: "pricing",
      component: Pricing_Page,
    },
    {
      path: "/pricing/success",
      name: "pricingSuccess",
      component: PremiumSuccess,
    },
    {
      path: "/test-listing",
      name: "testListing",
      component: TestListingCard,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "erreur404",
      component: Erreur404,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

export default router;
