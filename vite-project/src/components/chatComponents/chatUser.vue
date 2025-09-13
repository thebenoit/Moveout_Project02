<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="bg-gray-100 rounded-xl p-2 m-5">
    <p class="textcenter">{{ message.text }}</p>
  </div>
</template>
