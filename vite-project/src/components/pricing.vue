<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();



const btn_continuer_gratuitement = () =>{
  router.push("/listings");
}
//lien pour accéder au portail stripe
const customerPortalLink = ref(
  "https://buy.stripe.com/test_bIY01P7Jb9K665ydQQ"
);

</script>

<template>
  <div
    class="mt-10 p-2 flex-col sm:flex sm:flex-row justify-center sm:space-x-10 max-w-sm sm:max-w-max sm:w-full mx-auto sm:space-y-0 space-y-10"
  >
    <div
      class="flex flex-col border-black-600 border-2 shadow-black-600 shadow-lg rounded-3xl bg-white ring-1 ring-black/10"
    >
      <div class="p-8 pb-0 sm:p-10 sm:pb-0">
        <h3
          class="text-2xl font-semibold leading-8 tracking-tight text-black-600 mb-14"
          id="tier-hobby"
        >
          Gratuit
        </h3>

        <a
          @click="btn_continuer_gratuitement"
          class="inline-block bg-black text-white mb-5 px-4 py-2 rounded-full w-full text-center"
        >
          Continuer gratuitement

        </a>
      </div>
      <div class="flex flex-1 flex-col p-2 pt-0">
        <div
          class="flex flex-1 flex-col justify-between rounded-2xl p-6 pt-0 sm:p-8"
        >
          <ul role="list" class="space-y-6">
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-black-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">
                Accès centralisé aux annonces
              </p>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-black-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">filtrage</p>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-black-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">
                Mise à jour quotidienne
              </p>
            </li>
          </ul>
          <!-- <div class="mt-8">
                <a href="/login" class="inline-block w-full rounded-lg bg-gray-900 px-4 py-4 text-center text-sm font-semibold leading-5 text-white shadow-md hover:bg-white hover:text-gray-900 hover:ring hover:ring-gray-900" aria-describedby="tier-team">Get started today</a>
              </div> -->
        </div>
      </div>
    </div>
    <div
      class="flex flex-col border-blue-main border-2 shadow-blue-main shadow-lg rounded-3xl bg-white ring-1 ring-black/10"
    >
      <div class="p-8 pb-0 sm:p-10 sm:pb-0">
        <h3
          class="text-xl leading-8 tracking-tight text-blue-main"
          id="tier-team"
        >
          Pro
        </h3>
        <h3
          class="text-2xl font-semibold leading-8 tracking-tight text-blue-main mb-5"
          id="tier-team"
        >
          9.99$/mois
        </h3>
        <a
          :href="customerPortalLink"
          target="_blank"
          class="inline-block bg-blue-main text-white mb-5 px-4 py-2 rounded-full w-full text-center"
        >
          Aller Pro
        </a>
      </div>
      <div class="flex flex-1 flex-col p-2 pt-0">
        <div
          class="flex flex-1 flex-col justify-between rounded-2xl p-6 pt-0 sm:p-8"
        >
          <ul role="list" class="space-y-6">
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-blue-main"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">
                Tout du plan Gratuit
              </p>
            </li>

            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-blue-main"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">
                Notifications en temps réel ultra-rapides ⚡
              </p>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-blue-main"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">
                Recommandations personnalisées
              </p>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-blue-main"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">
                +5 Appartements par jours 🏡
              </p>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-blue-main"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">
                📞 Assistance 24/7 pour ne jamais être bloqué
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- <div
      class="flex flex-col border-amber-500 border-2 shadow-amber-500 shadow-lg rounded-3xl bg-white ring-1 ring-black/10"
    >
      <div class="p-8 pb-0 sm:p-10 sm:pb-0">
        <h3
          class="text-xl leading-8 tracking-tight text-amber-500"
          id="tier-team"
        >
          Premium
        </h3>
        <h3
          class="text-2xl font-semibold leading-8 tracking-tight text-amber-500 mb-5"
          id="tier-team"
        >
          19.99$/mois
        </h3>
        <a
          :href="customerPortalLink"
          target="_blank"
          class="inline-block bg-amber-500 text-white mb-5 px-4 py-2 rounded-full w-full text-center"
        >
          Aller Premium
        </a>
      </div>
      <div class="flex flex-1 flex-col p-2 pt-0">
        <div
          class="flex flex-1 flex-col justify-between rounded-2xl p-6 pt-0 sm:p-8"
        >
          <ul role="list" class="space-y-6">
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-amber-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">
                Tout du plan Pro
              </p>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-amber-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
              <p class="ml-3 text-sm leading-6 text-gray-600">
                +10 Appartements par jours 🏡
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div> -->
  </div>
  <!-- <div class="w-full flex">
        <button @click="clickCta" class="mt-16 mb-5 mx-auto text-3xl shadow-lg shadow-black-600">Rejoignez Moveout aujourd'hui gratuitement</button>
      </div> -->
</template>
