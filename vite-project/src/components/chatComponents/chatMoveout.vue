<script setup>

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div
    class="chat-bubble-user"
    >
        <div>
            {{ message.text }}
        </div>
    </div>
</template>

<style scoped>
.chat-bubble-user {
   
    border-radius: 12px;
    padding: 0.75rem 1rem;
    margin: 0.5rem 0;
    max-width: 70%;           /* Limite la largeur de la bulle */
    align-self: flex-end;     /* Aligne à droite si tu utilises flex */
    word-break: break-word;   /* Coupe les mots trop longs */
    overflow-wrap: anywhere;  /* Coupe aussi les URLs */
  }

</style>