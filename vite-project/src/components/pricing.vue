<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PricingCard from "./pricingCard.vue";
const router = useRouter();

let paymentLinkPro = ref("https://buy.stripe.com/bIY16vfST9LKbJu8wA");
let paymentLinkGolden = ref("https://buy.stripe.com/fZeaH5223e2014QaEK");


let points = [
  " 3 messages par jour pour dénicher les meilleures offres",
  "Accès à 20 langues différentes",
  "Cherche précisement l'annonce qui vous correspond",
  "Trouves des appartements Uniquement à Montreal",
];
let pointsPro = [
  "5 messages par jours",
  "Accès à 30 langues différentes",
  "Cherche précisement l'annonce qui vous correspond",
  "Trouves des appartements Uniquement à Montreal",
];
let pointsGolden = [
  " Texte autant que tu veux, reçois chaque nouveau listing en temps réel et passe devant tout le monde",
  "Accès à plus de 100 langues différentes",
  "Cherche précisement l'annonce qui vous correspond",
  "Trouves des appartements dans toute la région de Montréal(Laval, Longueuil,valleyfield,etc...)",
  " Assistant personnel visites : le robot organise les rendez-vous pour vous → moins de visites inutiles."
  
];

const btn_continuer_gratuitement = () => {
  router.push("/listings");
};

const handlePaymentLinkPro = () => {
  window.open(paymentLinkPro.value, "_blank");
};
const handlePaymentLinkGolden = () => {
  window.open(paymentLinkGolden.value, "_blank");
};
//lien pour accéder au portail stripe
const customerPortalLink = ref("https://buy.stripe.com/3cseXl7mn3nmcNy28a ");
</script>

<template>
  <div
    class="mt-10 p-2 flex flex-col items-center gap-10 md:flex-row md:justify-center md:items-stretch md:gap-6 max-w-sm md:max-w-6xl mx-auto"
  >
    <PricingCard
      
      titre="Gratuit"
      prix="0$/mois"
      description="Accès à toutes les fonctionnalités de Moveout Bot"
      buttonText="Cliquez pour continuer gratuitement"
      :points="points"
      class="w-full md:w-1/3"
      rabais="false"

    />
    <PricingCard
      titre="Pro"
      prix="4.99$/mois"
      description="Accès à toutes les fonctionnalités de Moveout Bot"
      :buttonLink="paymentLinkPro"
      buttonText="Cliquez pour continuer avec le plan Pro"
      :points="pointsPro"
      buttonColor="blue-main"
      borderColor="blue-main"
      shadowColor="blue-main"
      class="w-full md:w-1/3"
      prix_rabais="9.99$/mois"
      rabais="true"
      
    />
    <PricingCard
      titre="Golden"
      prix="6.99$/mois"
      description="Accès à toutes les fonctionnalités de Moveout Bot"
      :buttonLink="paymentLinkGolden"
      buttonText="Cliquez pour continuer avec le plan Golden"
      :points="pointsGolden"
      buttonColor="yellow-500"
      borderColor="yellow-500"
      shadowColor="yellow-500"
      class="w-full md:w-1/3"
      prix_rabais="17.99$/mois"
      rabais="true"
      
    />
  </div>
  <!-- <div class="w-full flex">
        <button @click="clickCta" class="mt-16 mb-5 mx-auto text-3xl shadow-lg shadow-black-600">Rejoignez Moveout aujourd'hui gratuitement</button>
      </div> -->
</template>
