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
    <div>
        <div v-for="message in messages" :key="message.id">
            <ChatUser v-if="message.isUser" :message="message" />
            <ChatMoveout v-else :message="message" />
        </div>
    </div>
    
</template>