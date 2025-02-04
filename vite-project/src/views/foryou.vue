<script setup>
import { ref } from "vue";
import PageWarning from "@/components/PageWarning.vue";
import utils from "@/utils/utils";
import Login from "@/views/Login.vue";
import pricingPage from "@/views/pricing_pages/pricing_page.vue";
import listings_pro from "@/views/Listings_pro.vue";
import { onMounted } from "vue";

let user = ref(null);
let user_id = ref(null);
let access = ref(false);
let notification = ref(false);

onMounted(async () => {
  const decoded = utils.decodeToken();

  if (decoded) {
    user_id.value = decoded.userId;
    try {
      //faire une requete pour récupérer les données de l'utilisateur
      user = await utils.get(`api/client/login/${user_id.value}`);
      //user trouvée
      if (user) {
        access.value = hasAccess(user);
      } else {
        console.log("user non trouvée");
        throw new Error("user non trouvée");
      }
      console.log('accès: ', access.value)
      console.log("user trouvée! ", user);
    } catch (error) {
      console.log("erreur lors de la recherche de user", error);
    }
  }
});

const hasAccess = (user) => {
  if (user.hasAccess === true) {
    return true;
  }
  return false;
};
const hasNotification = (notification) =>{
  if(notification){
    return true;
  }

  return false;
}

</script>

<template>
  <div v-if="!utils.getToken()">
    <Login />
  </div>
  <div v-else-if="utils.getToken() && !access">
    <pricingPage />
  </div>
  <div v-else-if="utils.getToken() && access">
    <listings_pro :userId="user_id" :preferencesId="user.preferencesId" />
  </div>

  <!-- <PageWarning /> -->
</template>

<style></style>
