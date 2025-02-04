<script>
export default {
  data() {
    return {
      showModal: false, // Control the modal visibility
    };
  },
};
</script>


<template>
    <div class="relative">
      <!-- Button to open the modal -->
      <button
        @click="showModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Open Modal
      </button>
  
      <!-- Modal Component -->
      <dialog
        v-if="showModal"
        class="fixed inset-0 flex items-end justify-center z-50 pointer-events-none modal"
      >
        <!-- The modal container -->
        <div
          class="pointer-events-auto bg-white rounded-t-lg shadow-lg p-6 mb-4 w-full max-w-md"
        >
          <h2 class="text-xl font-semibold mb-2">Modal Title</h2>
          <p class="mb-4">
            This is a modal that doesn’t darken the background and is positioned at the bottom.
          </p>
          <!-- <button
            @click="showModal = false"
            class="px-4 py-2 bg-red-600 text-white rounded"
          >
            Close Modal
          </button> -->
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
      </dialog>
    </div>
  </template>
  