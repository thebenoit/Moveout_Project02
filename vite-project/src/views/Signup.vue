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
const preferenceSurveyError = ref("");
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
  console.log("Min value changed:", value); // Vérifiez la valeur reçue
  selectedBudget.value.minValue = value;
};

const handleMaxValueChange = (value) => {
  console.log("Max value changed:", value); // Vérifiez la valeur reçue
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
        console.log("token preferenceId: ", decodedToken.prefId);
        if (decodedToken && decodedToken.prefId) {
          // Stocker prefId
          selectedIdPreference.value = decodedToken.prefId;

          nextSlide();
          console.log("changement de page: ");
        } else {
          console.log("erreur dans le decoded token: ", decodedToken);
          console.log(
            "erreur dans le decoded token préférenceID: ",
            decodedToken.prefId
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
const versConnection = () => {
  router.push({ path: "/login" });
};

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
      preferenceSurveyError.value = result.error;
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
<style>
  /* General Styles */
  .signup-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 1rem;
  }

  .signup-content {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
  }

  .signup-card {
    background-color: #ffffff;
    padding: 2.5rem 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: center;
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .signup-title {
    font-weight: 700;
    font-size: 1.8rem;
    color: #333333;
    margin-bottom: 0.5rem;
    animation: fadeIn 1s ease-out 0.2s;
    animation-fill-mode: both;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .signup-description {
    font-size: 1rem;
    color: #666666;
    margin-bottom: 2rem;
    animation: fadeIn 1s ease-out 0.4s;
    animation-fill-mode: both;
  }

  .input-group {
    margin-bottom: 1.5rem;
    animation: slideInLeft 0.8s ease-out 0.6s;
    animation-fill-mode: both;
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .input-group input, .input-group select, .input-group div {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #dddddd;
    border-radius: 8px;
    font-size: 1rem;
    color: #333333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .input-group input:focus, .input-group select:focus {
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    outline: none;
  }

  .signup-btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    background-color: #333333;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    animation: fadeIn 1s ease-out 0.8s;
    animation-fill-mode: both;
  }

  .signup-btn:hover, .login-btn:focus {
    background-color: #666666;
    transform: scale(1.02);
  }

  .signup-btn:active {
    transform: scale(0.98);
  }

  .signup-small {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666666;
    animation: fadeIn 1s ease-out 1s;
    animation-fill-mode: both;
  }

  .signup-link {
    color: rgba(0, 0, 0, 0.5);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .signup-link:hover {
    color: rgba(0, 0, 0, 0.7);
    text-decoration: underline;
  }

  .error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    animation: shake 0.5s ease-out;
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-10px);
    }
    50% {
      transform: translateX(10px);
    }
    75% {
      transform: translateX(-10px);
    }
  }

  .sign-width {
    width: 100%;
  }

  @media (min-width: 768px) {
    .signup-card {
      padding: 3rem 2.5rem;
    }

    .signup-title {
      font-size: 2rem;
    }

    .signup-description {
      font-size: 1.2rem;
    }

    .input-group {
      margin-bottom: 2rem;
    }

    .signup-btn {
      font-size: 1.2rem;
    }

    .signup-small {
      font-size: 1rem;
    }
  }

  @media (min-width: 1024px) {
    .signup-card {
      padding: 3.5rem 3rem;
    }

    .signup-title {
      font-size: 2.2rem;
    }

    .signup-description {
      font-size: 1.4rem;
    }

    .input-group {
      margin-bottom: 2.5rem;
    }

    .signup-btn {
      font-size: 1.4rem;
    }

    .signup-small {
      font-size: 1.1rem;
    }
  }
</style>

<template>
  <div>

    <section v-if="!hiddenFirst" class="signup-section">
      <div class="signup-content">
        <div class="signup-card">
          <!-- Error Message -->
          <p class="error-message">{{ errorMessages }}</p>

          <!-- Title and Description -->
          <h1 class="signup-title">Bienvenue !</h1>
          <p class="signup-description">Créez votre compte Moveout</p>

          <form @submit.prevent="signup">
            <div class="input-group">
              <input
                id="first-name"
                type="text"
                placeholder="Prénom"
                v-model="firstName"
                required
              >
            </div>

            <div class="input-group">
              <input
                id="last-name"
                type="text"
                placeholder="Nom de famille"
                v-model="lastName"
                required
              >
            </div>

            <div class="input-group">
              <input
                id="phone"
                type="tel"
                placeholder="Numéro de téléphone"
                v-model="phone"
                required
              >
            </div>

            <div class="input-group">
              <input
                id="email"
                type="email"
                placeholder="Email"
                v-model="email"
                required
              >
            </div>

            <div class="input-group">
              <input
                id="password"
                type="password"
                placeholder="Mot de passe"
                v-model="password"
                required
              >
            </div>

            <div class="input-group">
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirmez le mot de passe"
                v-model="confirmPassword"
                required
              >
            </div>

            <button class="signup-btn" type="submit">
              Rejoignez Moveout
            </button>
          </form>

          <p class="signup-small">
            Vous avez déjà un compte ? 
            <router-link to="/login" class="signup-link">
              Connectez-vous
            </router-link>
          </p>
        </div>
      </div>
    </section>

    <section v-else class="signup-section">
      <div class="signup-card sign-width">
        <h1 class="signup-title">Comprendre vos préférences...</h1><br>
        <p class="signup-description">Ces réponses nous permettront de sélectionner les appartements qui vous correspondent le mieux</p>
        <hr>
        <br>
        <div class="flex flex-wrap gap-4">
          <div class="input-group flex-1 min-w-[200px]">
            <label class="form-label">Combien de chambre?</label>
            <select
              v-model="selectedBedrooms"
              @change="handleBedroomsChange"
              className="select"
            >
              <option  value="" disabled={true} selected>Nombre de chambres</option>
              <option
                v-for="bedrooms in ['1', '2', '3', '4', '5+']"
                :key="bedrooms"
                :value="bedrooms"
                :selected="selectedBedrooms.includes(bedrooms)"
              >
                {{ bedrooms }}
              </option>
            </select>
          </div>

          <div class="input-group flex-1 min-w-[200px]">
            <label class="form-label">Budget Minimum</label>
            <input 
              type="number" 
              v-model="selectedBudget.minValue"
              min="0"
              max="10000"
              class="w-full p-2 border rounded"
            >
          </div>
          
          <div class="input-group flex-1 min-w-[200px]">
            <label class="form-label">Budget Maximum</label>
            <input
              type="number"
              v-model="selectedBudget.maxValue"
              min="0"
              max="10000"
              class="w-full p-2 border rounded"
            >
          </div>
        </div>
      
        <div class="flex flex-wrap gap-4">
          <div class="input-group flex-1 min-w-[200px]">
            <label class="form-label">Quelle est votre âge?</label>
            <select 
              v-model="selectedAge"
              class=""
            >
              <option value="" disabled selected>Sélectionnez votre tranche d'âge</option>
              <option v-for="age in ['18-25', '26-35', '36-45', '46+']" 
                      :key="age" 
                      :value="age">
                {{ age }}
              </option>
            </select>
          </div>
          <div class="input-group flex-1 min-w-[200px]">
            <label class="form-label">Quelle est votre Sexe?</label>
            <select 
              v-model="selectedGender"
              class=""
            >
              <option value="" disabled selected>Sélectionnez votre sexe</option>
              <option v-for="gender in ['Homme', 'Femme', 'Autre']" 
                      :key="gender" 
                      :value="gender">
                {{ gender }}
              </option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <label class="form-label">Quelle est votre situation professionnelle ?</label>
          <select 
            v-model="selectedOccupation"
            class=""
          >
            <option value="" disabled selected>Sélectionnez votre situation</option>
            <option 
              v-for="occupation in ['Étudiant', 'Sans Emplois', 'Employé', 'Entrepreneur', 'Retraité']"
              :key="occupation"
              :value="occupation"
            >
              {{ occupation }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label class="form-label"> Quartier de préférence (Sélection multiple) </label>
          <div class="border-2 rounded-lg p-2 h-60 overflow-y-auto">
            <template v-for="(neighborhoods, borough) in quartiers" :key="borough">
              <div class="mb-2">
                <h3 class="font-semibold text-gray-900 mb-2">{{ borough }}</h3>
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="neighborhood in neighborhoods"
                    :key="neighborhood"
                    class="flex items-center px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                    :class="{ 'bg-blue-100 hover:bg-blue-200': selectedNeighborhoods.includes(neighborhood) }"
                  >
                    <input
                      type="checkbox"
                      :value="neighborhood"
                      v-model="selectedNeighborhoods"
                      class="h-4 w-auto text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                    >
                    <span>{{ neighborhood }}</span>
                  </label>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="input-group">
              <label class="form-label">Quel genre de services supplémentaires seriez-vous intéressé(e) ? </label>
              <input
                v-model="customService"
                type="text"
                placeholder="Précisez le service"
                class=""
              />
          </div>

        <p class="error-message">{{ preferenceSurveyError }}</p>
        <button @click="preferenceCreation" class="signup-btn w-full mt-6"> Next </button>
      </div>
    </section>
  </div>
</template>

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
v-if="!hiddenFirst"
v-else