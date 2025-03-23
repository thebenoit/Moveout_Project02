<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import utils_notif from "../utils/utils_notification_server.js";
import utils from "../utils/utils.js";
import ForYouModal from "../components/foryou_modal.vue";

let props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  preferencesId: {
    type: String,
    required: true,
  },
});

onMounted(async () => {
  response.value = await utils_notif.get("api/notification/" + props.userId);
  console.log("userId: ", props.userId);
  console.log("response: ", response.value);
  notifStatus.value = await notifEstActif(response.value);
});
const apparts = ref([]);
const selectedDays = ref([]);
const response = ref([]);
const notifStatus = ref(false);

// vérifier si la notification est active
const notifEstActif = async (notif) => {
  if (notif.data.status === "recurring") {
    return true;
  } else {
    return false;
  }
};

onMounted(async () => {
  try {
    response.value = await utils_notif.get("api/notification/" + props.userId);

    console.log("userId: ", props.userId);
    console.log("response: ", response.value);
    notifStatus.value = await notifEstActif(response.value);
  } catch (error) {
    console.log("erreur dans la récupération de la notification: ", error);
  }
});

// Fonction pour gérer la sélection du nombre de chambres

const toggleDaysSelection = (day) => {
  if (selectedDays.value.includes(day)) {
    //remove if already selected
    selectedDays.value = selectedDays.value.filter((n) => n !== day);
  } else {
    selectedDays.value.push(day);
  }
};
//Enregistrer la notification
const enregistrer = async () => {
  console.log("user id: ", props.userId);
  console.log("preference id: ", props.preferencesId);
  console.log("selected days: ", JSON.stringify(selectedDays.value));
  try {
    response.value = await utils_notif.post("api/notification/send", {
      event: "notification_bot",
      preferenceId: props.preferencesId,
      notificationTimes: ["10:00"],
      userId: props.userId,
      notificationDays: selectedDays.value,
    });
    console.log("Enregistrer... ", response.value);

    // Fermer le modal
    document.getElementById("config_notif_modal").close();
  } catch (error) {
    console.log("erreur dans l'enregistrement: ", error);
  }
};
</script>

<template>
  <div>
    <div
      class="flex flex-col items-center justify-center m-20 space-around gap-20"
    >
      <button
        class="p-2 bg-blue-main rounded-xl w-16 h-16 shadow-lg"
        onclick="config_notif_modal.showModal()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12 text-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
    </div>

    <div
      class="flex-1 flex flex-col items-center justify-center text-center"
      v-if="!notifStatus"
    >
      <p>
        Appuyer sur le bouton ci-dessus pour
        <a class="text-blue-main">activer</a>
      </p>
      <p>ou <a class="text-blue-main">modifier</a> vos notifications</p>
    </div>
    <div
      class="flex-1 flex flex-col items-center justify-center text-center"
      v-else
    >
      <p>
        Vos notifications sont
        <a class="text-blue-main">activées</a>
      </p>
    </div>
    <!-- <button
        class="p-2 bg-blue-main rounded-xl w-16 h-16 shadow-lg"

        onclick="historique_modal.showModal()"

      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12 text-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      </button> -->

    <dialog id="config_notif_modal" class="modal mt-10">
      <div
        class="modal-box flex flex-col gap-4 bg-transparent border-none shadow-none"
      >
        <div class="overflow-y-auto max-h-[30vh] flex flex-col gap-4">
          <button
            class="px-4 py-2 rounded-xl border m-2"
            v-for="Days in [
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
              'sunday',
            ]"
            :key="Days"
            @click="toggleDaysSelection(Days)"
            :class="{
              'bg-blue-main text-white': selectedDays.includes(Days),
              'bg-gray-200 text-gray-700': !selectedDays.includes(Days),
            }"
          >
            {{ Days }}
          </button>
        </div>
        <button class="btn btn-primary mt-4" @click="enregistrer">
          Enregistrer
        </button>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <dialog id="historique_modal" class="modal">
      <div class="modal-box flex flex-col gap-4">
        <h1>Historique</h1>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
