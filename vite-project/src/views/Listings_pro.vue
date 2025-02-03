<script setup>
import { ref } from "vue";

const selectedDays = ref([]);

// Fonction pour gérer la sélection du nombre de chambres
const toggleDaysSelection = (day) => {
  if (selectedDays.value.includes(day)) {
    //remove if already selected
    selectedDays.value = selectedDays.value.filter((n) => n !== day);
  } else {
    selectedDays.value.push(day);
  }
};

const enregistrer = () => {};
</script>

<template>
  <div>
    <div class="flex flex-col m-20 space-around gap-5">
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
      <button class="p-2 bg-blue-main rounded-xl w-16 h-16 shadow-lg">
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
      </button>
    </div>

    <dialog id="config_notif_modal" class="modal">
      <div class="modal-box flex flex-col gap-4">
        <button
          class="px-4 py-2 rounded-xl border m-2"
          v-for="Days in [
            'Lundi',
            'Mardi',
            'Mercredi',
            'Jeudi',
            'Vendredi',
            'Samedi',
            'Dimanche',
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
        <button class="btn btn-primary">Enregistrer</button>
      </div>
    </dialog>
  </div>
</template>
