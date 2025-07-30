import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import HomeNew from "@/views/HomeNew.vue";
import Appartements from "@/views/Appartements.vue";
import Demenagement from "@/views/Demenagement.vue";
import AboutUs from "@/views/AboutUs.vue";
import ContactUs from "@/views/ContactUs.vue";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Foryou from "@/views/foryou.vue";
import Preferences from "@/views/PreferenceSurvey/Preferences.vue";
import Settings from "@/views/Settings.vue";
import LandingPage from "@/views/landingPages/landingPage.vue";
import LandingPageSignup from "@/views/landingPages/landingPage-signup.vue";
import LandingPageSuccess from "@/views/landingPages/landingPage-success.vue";
import Erreur404 from "@/views/Erreur404.vue";
import Listings from "@/views/Listings.vue";
import Pricing_Page from "@/views/pricing_pages/pricing_page.vue";
import ChatHome from "@/views/ChatHome.vue";
import CardPage from "@/components/listingcard/cardPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeNew,
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatHome,
    },
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
    {
      path: "/foryou",
      name: "foryou",
      component: Foryou,
    },
    {
      path: "/pricing",
      name: "pricing",
      component: Pricing_Page,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "erreur404",
      component: Erreur404,
    },

  ],
});

export default router;
