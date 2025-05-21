<script setup>

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div>
        <div>
            {{ message.text }}
        </div>
    </div>
</template>

<style scoped>

</style>