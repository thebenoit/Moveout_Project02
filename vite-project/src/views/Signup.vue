<script setup>
import { onMounted, ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSlider from "@/components/ui/input/multirange-input/multiRangeInput.vue";
import utils from "../utils/utils";
import { useRouter } from "vue-router";

const firstName = ref("");
const lastName = ref("");
const phone = ref("");
const email = ref("");
const confirmEmail = ref("");
const password = ref("");
const confirmPassword = ref("");

const minValue = ref(0);
const maxValue = ref(100);

const errorMessages = ref("");
const hiddenFirst = ref(false);

const quartiers = {
  "Ahuntsic-Cartierville": ["Ahuntsic", "Cartierville", "Sault-au-Récollet"],
  Anjou: ["Anjou"],
  "Côte-des-Neiges–Notre-Dame-de-Grâce": [
    "Côte-des-Neiges",
    "Notre-Dame-de-Grâce",
  ],
  Lachine: ["Lachine", "Saint-Pierre"],
  LaSalle: ["LaSalle"],
  "Le Plateau-Mont-Royal": ["Le Plateau", "Mile End", "Milton-Parc"],
  "Le Sud-Ouest": [
    "Griffintown",
    "Little Burgundy",
    "Pointe-Saint-Charles",
    "Saint-Henri",
    "Ville-Émard",
    "Côte-Saint-Paul",
  ],
  "L'Île-Bizard–Sainte-Geneviève": ["L'Île-Bizard", "Sainte-Geneviève"],
  "Mercier–Hochelaga-Maisonneuve": [
    "Hochelaga-Maisonneuve",
    "Mercier-Ouest",
    "Mercier-Est",
  ],
  "Montréal-Nord": ["Montréal-Nord"],
  Outremont: ["Outremont"],
  "Pierrefonds-Roxboro": ["Pierrefonds", "Roxboro"],
  "Rivière-des-Prairies–Pointe-aux-Trembles": [
    "Pointe-aux-Trembles",
    "Rivière-des-Prairies",
  ],
  "Rosemont–La Petite-Patrie": ["La Petite-Patrie", "Rosemont"],
  "Saint-Laurent": ["Saint-Laurent"],
  "Saint-Léonard": ["Saint-Léonard"],
  Verdun: ["Verdun", "Île-des-Sœurs"],
  "Ville-Marie": [
    "Old Montréal",
    "Chinatown",
    "Downtown",
    "Quartier des Spectacles",
    "Golden Square Mile",
    "Gay Village",
    "Shaughnessy Village",
  ],
  "Villeray–Saint-Michel–Parc-Extension": [
    "Parc-Extension",
    "Saint-Michel",
    "Villeray",
  ],
  Westmount: ["Westmount"],
};

// Store selected neighborhoods
const selectedNeighborhoods = ref([]);

const toggleSelection = (neighborhood) => {
  if (selectedNeighborhoods.value.includes(neighborhood)) {
    // Remove if already selected
    selectedNeighborhoods.value = selectedNeighborhoods.value.filter(
      (n) => n !== neighborhood
    );
  } else {
    // Add if not selected
    selectedNeighborhoods.value.push(neighborhood);
  }
};

const router = useRouter();

async function nextSlide() {
  hiddenFirst.value = true;
}
async function previousSlide() {
  hiddenFirst.value = false;
}
async function signup() {
  try {
    let result = await utils.post("api/client/signup", {
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      email: email.value,
      //"confirmEmail": confirmEmail.value,
      password: password.value,
      //"confirmPassword": confirmPassword.value
    });
    if (result.error) {
      console.log('result.error: ',result.error.message)
      errorMessages.value = result.error?.message;
      console.log("error: ", errorMessages);
    } else {
      result = await result.json();
      console.log(result.token);

      if (result.token) {
        utils.setToken(result.token);
        //router.push({ path: '/foryou' })
        hiddenFirst.value = true;
      }
    }
  } catch (error) {
    console.error("Error during signup:", error);
    errorMessages.value =
      "Une erreur est survenue lors de l'inscription. Vérifiez votre mot de passe : il doit contenir une majuscule, une minuscule, un caractère spécial et avoir au moins 8 caractères.";
    console.log("error2: ", errorMessages);
  }
}
</script>
<template>
  <div>
    <section
      v-if="!hiddenFirst"
      class="max-w-xl lg:max-w-3xl mx-auto p-4 overflow-hidden"
    >
      <div class="mt-0">
        <Card class="bg-gray-200 backdrop-blur-3xl mt-16 lg:mt-0">
          <p class="text-red-500 text-sm m-5 text-center p-2 rounded-lg">{{ errorMessages }}</p>
          <CardHeader>
            <CardTitle class="text-xl">
              Inscrivez-vous gratuitement!
            </CardTitle>
            <CardDescription class="text-lg">
              Rejoignez Moveout aujourd'hui gratuitement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Input
                    class="btn text-left"
                    id="first-name"
                    placeholder="First name"
                    required
                    v-model="firstName"
                  />
                </div>
                <div class="grid gap-2">
                  <Input
                    class="btn text-left"
                    id="last-name"
                    placeholder="Last name"
                    required
                    v-model="lastName"
                  />
                </div>
              </div>
              <div class="grid mt-1">
                <Input
                  class="btn text-left"
                  id="phone"
                  type="phone"
                  placeholder="Phone number"
                  required
                  v-model="phone"
                />
              </div>
              <div class="grid mt-1">
                <Input
                  class="btn text-left"
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  v-model="email"
                />
              </div>
              <div class="grid mt-1">
                <Input
                  class="btn text-left"
                  id="password"
                  type="password"
                  placeholder="Password"
                  v-model="password"
                />
              </div>

              <Button
                type="submit"
                class="btn btn-lg w-full text-base bg-blue-main hover: overflow-hidden"
                @click="signup"
              >
                Rejoignez Moveout gratuitement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <section v-if="hiddenFirst" class="max-w-xl lg:max-w-3xl mx-auto p-4">
      <div class="w-full flex jusitfy-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mt-2 ml-5 hover:text-blue-main"
          @click="previousSlide"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="{1.5}"
          stroke="currentColor"
          width="26"
          height="26"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </div>

      <section>
        <h1 class="text-xl text-blue-main text-center">
          Comprendre vos préférences...
        </h1>
      </section>

      <section class="mt-8">
        <div class="bg-gray-200 p-6 border-2 rounded-md shadow-lg">
          <h2 class="text-gray-500 text-center">
            Ces réponses nous permettront de sélectionner les appartements qui
            vous correspondent le mieux
          </h2>
        </div>

        <div class="mt-8">
          <div class="border-2 rounded-lg shadow-lg p-6">
            <h1 class="text-blue-main text-center mb-5">Combien de chambre?</h1>
            <ul class="flex justify-center space-x-4">
              <li><p class="btn btn-active">1</p></li>
              <li><p class="btn btn-active">2</p></li>
              <li><p class="btn btn-active">3</p></li>
              <li><p class="btn btn-active">4</p></li>
              <li><p class="btn btn-active">5+</p></li>
            </ul>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-6 mt-8">
            <h1 class="text-blue-main text-center mb-5">Votre Budget</h1>
            <MultiSlider
              :min="0"
              :max="100"
              @update:minValue="minValue = $event"
              @update:maxValue="maxValue = $event"
            ></MultiSlider>
          </div>

          <div
            class="border-2 rounded-lg shadow-lg p-6 mt-8 max-h-60 overflow-y-scroll"
          >
            <h1 class="text-blue-main text-center mb-5">
              Quartier de préférence
            </h1>
            <div
              v-for="(neighborhoods, borough) in quartiers"
              :key="borough"
              class="mb-4"
            >
              <h2 class="text-lg text-gray-700 mb-2">{{ borough }}</h2>

              <!-- Loop through neighborhoods within each borough -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="neighborhood in neighborhoods"
                  :key="neighborhood"
                  @click="toggleSelection(neighborhood)"
                  :class="{
                    'bg-blue-main text-white':
                      selectedNeighborhoods.includes(neighborhood),
                    'bg-gray-200 text-gray-700':
                      !selectedNeighborhoods.includes(neighborhood),
                  }"
                  class="px-4 py-2 rounded-md border"
                >
                  {{ neighborhood }}
                </button>
              </div>
            </div>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Quelle est votre âge?
            </h1>
            <div
              class="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <label class="flex items-center">
                <input
                  type="radio"
                  name="age"
                  value="18-25"
                  v-model="age"
                  class="mr-2"
                />
                18-25
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="age"
                  value="26-35"
                  v-model="age"
                  class="mr-2"
                />
                26-35
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="age"
                  value="36-45"
                  v-model="age"
                  class="mr-2"
                />
                36-45
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="age"
                  value="46+"
                  v-model="age"
                  class="mr-2"
                />
                46+
              </label>
            </div>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Quelle est votre situation professionnelle ?
            </h1>
            <div
              class="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <label class="flex items-center">
                <input
                  type="radio"
                  name="profession"
                  value="Étudiant"
                  v-model="profession"
                  class="mr-2"
                />
                Étudiant
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="profession"
                  value="Employé"
                  v-model="profession"
                  class="mr-2"
                />
                Employé
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="profession"
                  value="Auto-entrepreneur"
                  v-model="profession"
                  class="mr-2"
                />
                Entrepreneur
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="profession"
                  value="Sans emploi"
                  v-model="profession"
                  class="mr-2"
                />
                Sans emploi
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="profession"
                  value="Retraité"
                  v-model="profession"
                  class="mr-2"
                />
                Retraité
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="profession"
                  value="Autre"
                  v-model="profession"
                  class="mr-2"
                />
                Autre
              </label>
            </div>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Quel est votre revenu mensuel approximatif ?
            </h1>
            <div
              class="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <label class="flex items-center">
                <input
                  type="radio"
                  name="revenu"
                  value="Moins de 1000$"
                  v-model="revenu"
                  class="mr-2"
                />
                Moins de 1000$
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="revenu"
                  value="1000$ - 2000$"
                  v-model="revenu"
                  class="mr-2"
                />
                1000$ - 2000$
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="revenu"
                  value="2000$ - 3000$"
                  v-model="revenu"
                  class="mr-2"
                />
                2000$ - 3000$
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="revenu"
                  value="3000$ - 4000$"
                  v-model="revenu"
                  class="mr-2"
                />
                3000$ - 4000$
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="revenu"
                  value="Plus de 4000$"
                  v-model="revenu"
                  class="mr-2"
                />
                Plus de 4000$
              </label>
            </div>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Comment avez-vous entendu parler de notre site ?
            </h1>
            <div
              class="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <label class="flex items-center">
                <input
                  type="radio"
                  name="source"
                  value="Réseaux sociaux"
                  v-model="source"
                  class="mr-2"
                />
                Réseaux sociaux
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="source"
                  value="Recherche Google"
                  v-model="source"
                  class="mr-2"
                />
                Recherche Google
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="source"
                  value="Recommandation d'un ami"
                  v-model="source"
                  class="mr-2"
                />
                Recommandation d'un ami
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="source"
                  value="Publicité"
                  v-model="source"
                  class="mr-2"
                />
                Publicité
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="source"
                  value="Autre"
                  v-model="source"
                  class="mr-2"
                />
                Autre (précisez)
              </label>
            </div>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Quel genre de services supplémentaires seriez-vous intéressé(e) ?
            </h1>
            <div class="flex flex-wrap gap-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  name="services"
                  value="Déménagement"
                  v-model="services"
                  class="mr-2"
                />
                Déménagement
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  name="services"
                  value="Décoration intérieure"
                  v-model="services"
                  class="mr-2"
                />
                Décoration intérieure
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  name="services"
                  value="Autre"
                  v-model="services"
                  class="mr-2"
                />
                Autre (précisez)
              </label>
            </div>
          </div>

          <button class="btn btn-accent w-full mt-6">Next</button>
        </div>
      </section>
    </section>
  </div>

  <!-- <button class="btn" onclick="signup.showModal()">open modal</button> -->
  <!-- <dialog id="signup" class="modal modal-bottom sm:modal-middle">
 <div class="absolute flex h-screen">
     <div class="mt-0">
       <Card class="bg-gray-200 backdrop-blur-3xl mt-16 lg:mt-0 ">
         <CardHeader>
           <CardTitle class="text-xl">
             Inscrivez-vous gratuitement!
           </CardTitle>
           <CardDescription class="text-lg">
             Rejoignez Moveout aujourd'hui gratuitement
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div class="grid gap-4">
             <div class="grid grid-cols-2 gap-4">
               <div class="grid gap-2">
                 <Input class="btn text-left" id="first-name" placeholder="First name" required v-model="firstName" />
               </div>
               <div class="grid gap-2">
                 <Input class="btn text-left" id="last-name" placeholder="Last name" required v-model="lastName" />
               </div>
             </div>
             <div class="grid mt-1">
               <Input class="btn text-left" id="phone" type="phone" placeholder="Phone number" required v-model="phone" />
             </div>
             <div class="grid mt-1">
               <Input class="btn text-left" id="email" type="email" placeholder="Email" required v-model="email" />
             </div>
             <div class="grid mt-1">
               <Input class="btn text-left" id="password" type="password" placeholder="Password" v-model="password" />
             </div>
             <Button type="submit" class="btn btn-lg w-full text-lg bg-red-500 hover:bg-red-300 " @click="signup">
               Rejoignez Moveout gratuitement
             </Button>
           </div>
         </CardContent>
       </Card>
     </div>
 </div>
</dialog> -->
</template>
