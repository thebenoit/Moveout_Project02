<script setup>

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
})

</script>

<template>
    <div class="bg-gray-100 rounded-lg p-2 m-5">
        {{ message.text }}
    </div>
</template>