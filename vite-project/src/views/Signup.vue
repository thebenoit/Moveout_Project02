<script setup>
import * as jwtDecode from "jwt-decode";
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
import { decodeJwt } from "jose";
//import { default as jwt_decode } from 'jwt-decode';

const firstName = ref("");
const lastName = ref("");
const phone = ref("");
const email = ref("");
const confirmEmail = ref("");
const password = ref("");
const confirmPassword = ref("");

const minValue = ref(0);
const maxValue = ref(100);

// Store selected neighborhoods
const selectedNeighborhoods = ref([]);
// Store selected number of bedrooms
const selectedBedrooms = ref([]);
const selectedBudget = ref({
  minValue: 0,
  maxValue: 100,
});
const selectedIdPreference = ref("");
const selectedGender = ref("");
const selectedOccupation = ref("");
const selectedSalary = ref("");
const selectedReference = ref("");
const selectedAge = ref("");
const selectedAddOnService = ref("");
const autreClicked = ref(false);
const customService = ref("");

// const survey = {
//   numberOfBedrooms: selectedBedrooms,
//   Budget: selectedBudget,
//   locationsPreferences: selectedNeighborhoods,
//   age: selectedAge,
//   gender: selectedGender,
//   occupation: selectedOccupation,
//   salary: selectedSalary,
//   reference: selectedReference,
//   addOnService: customService,
// };

const errorMessages = ref("");
const preferenceSurveyError = ref("")
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

// Fonction pour gérer la sélection du nombre de chambres
const toggleBedroomsSelection = (bedrooms) => {
  if (selectedBedrooms.value.includes(bedrooms)) {
    //remove if already selected
    selectedBedrooms.value = selectedBedrooms.value.filter(
      (n) => n !== bedrooms
    );
  } else {
    console.log("push bedrooms: ", bedrooms);
    selectedBedrooms.value.push(bedrooms);
  }
};

const toggleAgeSelection = (age) => {
  selectedAge.value = age;
};

const toggleGenderSelection = (gender) => {
  selectedGender.value = gender;
};

const toggleSalarySelection = (salary) => {
  selectedSalary.value = salary;
};

const toggleOccupationSelection = (occupation) => {
  selectedOccupation.value = occupation;
};

const toggleReferenceSelection = (reference) => {
  selectedReference.value = reference;
};


const handleMinValueChange = (value) => {
  console.log('Min value changed:', value); // Vérifiez la valeur reçue
  selectedBudget.value.minValue = value;
};

const handleMaxValueChange = (value) => {
  console.log('Max value changed:', value); // Vérifiez la valeur reçue
  selectedBudget.value.maxValue = value;
};

// const toggleAddOnServiceSelection = (addOnService) => {
//   if (selectedAddOnService.value === addOnService) {
//     selectedAddOnService.value = "";
//   } else {
//     selectedAddOnService.value = addOnService;
//     autreClicked.value = false; // Désactiver le champ "Autre" s'il est sélectionné
//   }
// };

const toggleAddOnServiceSelectionAutre = (addOnService) => {
  selectedAddOnService(addOnService);
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
      console.log("result.error: ", result.error.message);
      errorMessages.value = result.error?.message;
      console.log("error: ", result.error);
    } else {
      console.log("result ", result);
      //result = await result.json();

      if (result.token) {
        utils.setToken(result.token);

        // Décoder le token JWT pour accéder à preferenceId
        const decodedToken = decodeJwt(result.token);
        console.log("decoded token: ", decodedToken);
        console.log("token preferenceId: ", decodedToken.preferenceId);
        if (decodedToken && decodedToken.preferenceId) {
          // Stocker preferenceId
          selectedIdPreference.value = decodedToken.preferenceId;

          nextSlide();
          console.log("changement de page: ");
        } else {
          console.log("erreur dans le decoded token: ", decodedToken);
          console.log(
            "erreur dans le decoded token préférenceID: ",
            decodedToken.preferenceId
          );
        }
      }
    }
  } catch (error) {
    console.error("Error during signup:", error);
    errorMessages.value = "Une erreur est survenue lors de l'inscription.";
    console.log("error2: ", errorMessages);
  }
}

async function preferenceCreation() {
  try {
    console.log("bedrooms: ", selectedBedrooms.value);
    console.log("budgetMax: ", selectedBudget.value.maxValue);
    console.log("budgetMin: ", selectedBudget.value.minValue);
    console.log("age: ", selectedAge.value);

    console.log("addOnService: ", customService.value);
    console.log("genre: ", selectedGender.value);
    console.log("reference: ", selectedReference.value);
    console.log("occupation: ", selectedOccupation.value);

    let result = await utils.post("api/client/preference", {
      preferencesId: selectedIdPreference.value,
      numberOfBedrooms: selectedBedrooms.value,
      age: selectedAge.value,
      gender: selectedGender.value,
      locationPreferences: selectedNeighborhoods.value,
      occupation: selectedOccupation.value,
      reference: selectedReference.value,
      minValue: selectedBudget.value.minValue,
      maxValue: selectedBudget.value.maxValue,
      addOnService: customService.value,
    });
    console.log("Raw response: ", result);

    if (result.error) {
      console.log("result.errorPreference: ", result.error?.message);
      //errorMessages.value = result.error?.message;
      preferenceSurveyError.value = result.error
      
    } else {
      console.log("resultPreference ", result);
      //result = await result.json();

      if (result.token) {
        utils.setToken(result.token);
        
      }
      if (result.success) {
     router.push({ path: "/foryou" });
      console.log("changement de page: ");
}
    }
  } catch (error) {
    console.error("Error during signup Preference:", error);
    //errorMessages.value = "Une erreur est survenue lors de l'inscription.";
    console.log("error2Pref: ", errorMessages);
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
          <p class="text-red-500 text-sm text-center rounded-lg">
            {{ errorMessages }}
          </p>
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
        <p class="text-red-500 text-center mt-2">{{ preferenceSurveyError }}</p>
        <div class="mt-8">
          <div class="border-2 rounded-lg shadow-lg p-6">
            <h1 class="text-blue-main text-center mb-5">Combien de chambre?</h1>
            <ul class="flex justify-center space-x-4">
              <li>
                <button
                  v-for="bedrooms in ['1', '2', '3', '4', '5+']"
                  :key="bedrooms"
                  @click="toggleBedroomsSelection(bedrooms)"
                  :class="{
                    ' bg-blue-main text-white':
                      selectedBedrooms.includes(bedrooms),
                    ' bg-gray-200 text-gray-700':
                      !selectedBedrooms.includes(bedrooms),
                  }"
                  class="px-4 py-2 rounded-md border m-2"
                >
                  {{ bedrooms }}
                </button>
              </li>
            </ul>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-6 mt-8">
            <h1 class="text-blue-main text-center mb-5">Votre Budget</h1>
            <MultiSlider
              :min="0"
              :max="100"
              @update:minValue="handleMinValueChange"
              @update:maxValue="handleMaxValueChange"
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
            <ul class="flex justify-center space-x-4">
              <li>
                <button
                  v-for="age in ['18-25', '26-35', '36-45', '46+']"
                  :key="age"
                  @click="toggleAgeSelection(age)"
                  :class="{
                    ' bg-blue-main text-white': selectedAge === age,
                    ' bg-gray-200 text-gray-700': selectedAge !== age,
                  }"
                  class="px-4 py-2 rounded-md border m-2"
                >
                  {{ age }}
                </button>
              </li>
            </ul>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Quelle est votre Sexe?
            </h1>
            <ul class="flex justify-center space-x-4">
              <li>
                <button
                  v-for="gender in ['Homme', 'Femme']"
                  :key="gender"
                  @click="toggleGenderSelection(gender)"
                  :class="{
                    ' bg-blue-main text-white': selectedGender === gender,
                    ' bg-gray-200 text-gray-700': selectedGender !== gender,
                  }"
                  class="px-4 py-2 rounded-md border m-2"
                >
                  {{ gender }}
                </button>
              </li>
            </ul>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Quelle est votre situation professionnelle ?
            </h1>

            <ul class="flex justify-center space-x-4">
              <li>
                <button
                  v-for="occupation in [
                    'Étudiant',
                    'Sans Emplois',
                    'Employé',
                    'Entrepreneur',
                    'retraité',
                  ]"
                  :key="occupation"
                  @click="toggleOccupationSelection(occupation)"
                  :class="{
                    ' bg-blue-main text-white':
                      selectedOccupation === occupation,
                    ' bg-gray-200 text-gray-700':
                      selectedOccupation !== occupation,
                  }"
                  class="px-4 py-2 rounded-md border m-2"
                >
                  {{ occupation }}
                </button>
              </li>
            </ul>
          </div>

          <!-- <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Quel est votre revenu mensuel approximatif ?
            </h1>
            <ul class="flex justify-center space-x-4">
              <li>
                <button
                  v-for="salary in ['<1000', '1000-2000', '2000-3000', '3000-4000', '>4000']"
                  :key="salary"
                  @click="toggleSalarySelection(salary)"
                  :class="{
                    ' bg-blue-main text-white': selectedSalary === salary,
                    ' bg-gray-200 text-gray-700': selectedSalary !== salary,
                  }"
                  class="px-4 py-2 rounded-md border m-2"
                >
                  {{ salary }}
                </button>
              </li>
            </ul>
          </div> -->

          <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Comment avez-vous entendu parler de notre site ?
            </h1>

            <ul class="flex justify-center space-x-4">
              <li>
                <button
                  v-for="reference in [
                    'Recherche Google',
                    `référence d'un ami  `,
                    'réseaux sociaux',
                    'Publicité',
                  ]"
                  :key="reference"
                  @click="toggleReferenceSelection(reference)"
                  :class="{
                    ' bg-blue-main text-white': selectedReference === reference,
                    ' bg-gray-200 text-gray-700':
                      selectedReference !== reference,
                  }"
                  class="px-4 py-2 rounded-md border m-2"
                >
                  {{ reference }}
                </button>
              </li>
            </ul>
          </div>

          <div class="border-2 rounded-lg shadow-lg p-4 sm:p-6 mt-8">
            <h1 class="text-blue-main text-center text-lg sm:text-xl mb-5">
              Quel genre de services supplémentaires seriez-vous intéressé(e) ?
            </h1>
            <input
              v-model="customService"
              type="text"
              placeholder="Précisez le service"
              class="input input-bordered w-full max-w-xs mt-2"
            />
            <!-- <ul class="flex justify-center space-x-4"> -->
            <!-- <li>
                <button
                  v-for="addOnService in [
                    'Déménagement',
                    `décoration de maison`,
                  ]"
                  :key="addOnService"
                  @click="toggleAddOnServiceSelection(addOnService)"
                  :class="{
                    ' bg-blue-main text-white':
                      selectedAddOnService === addOnService,
                    ' bg-gray-200 text-gray-700':
                      selectedAddOnService !== addOnService,
                  }"
                  class="px-4 py-2 rounded-md border m-2"
                >
                  {{ addOnService }}
                </button>
              </li> -->
            <!-- <li>
                <button
                  @click="autreClicked = !autreClicked"
                  :class="{
                    'bg-blue-main text-white': autreClicked,
                    'bg-gray-200 text-gray-700': !autreClicked,
                  }"
                  class="px-4 py-2 rounded-md border m-2"
                >
                  Autre
                </button>
                
              </li> -->
            <!-- </ul> -->
          </div>
          <p class="text-red-500 text-center mt-2">{{ preferenceSurveyError }}</p>
          <button
            @click="preferenceCreation"
            class="btn btn-accent w-full mt-6"
          >
            Next
          </button>
        </div>
      </section>
    </section>
  </div>
</template>
