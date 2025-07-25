<script setup>
import ChatUser from "./chatUser.vue";
import ChatMoveout from "./chatMoveout.vue";

const props = defineProps({
    sessionId: {
        type: String,
        required: true
    },
    messages: 
    {
        type: Array,
        required: true
    }
})


</script>

<template>
    <div class="d-flex flex-column w-100">
        <div v-for="message in messages" :key="message.id" class="d-flex flex-column">
            <ChatUser class="align-self-end"
            v-if="message.isUser" 
            :message="message" />
            <ChatMoveout v-else class="align-self-start" :message="message" />
        </div>
    </div>
    
</template>