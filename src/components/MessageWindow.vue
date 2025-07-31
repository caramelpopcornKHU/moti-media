<template>
  <div class="card" v-if="selectedUser">
    <div class="card-header">
      <div class="card-title">
        <h2>{{ selectedUser.name }}</h2>
      </div>
    </div>
    <div class="card-body" id="kt_chat_messenger_body">
      <div class="scroll-y me-n5 pe-5 h-300px h-lg-auto" ref="messageContainer">
        <div v-for="message in messages" :key="message.id" class="d-flex mb-10" :class="{'justify-content-end': message.sender_id === authStore.user?.id, 'justify-content-start': message.sender_id !== authStore.user?.id}">
          <div class="d-flex flex-column" :class="{'align-items-end': message.sender_id === authStore.user?.id, 'align-items-start': message.sender_id !== authStore.user?.id}">
            <div class="d-flex align-items-center mb-2">
              <div v-if="message.sender_id !== authStore.user?.id" class="symbol symbol-35px symbol-circle">
                <img alt="Pic" src="/metronic/media/avatars/300-1.jpg" />
              </div>
              <div class="ms-3">
                <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary me-1">{{ message.sender_name }}</a>
                <span class="text-muted fs-7 mb-1">{{ new Date(message.created_at).toLocaleTimeString() }}</span>
              </div>
              <div v-if="message.sender_id === authStore.user?.id" class="symbol symbol-35px symbol-circle">
                <img alt="Pic" src="/metronic/media/avatars/300-2.jpg" />
              </div>
            </div>
            <div class="p-5 rounded text-dark fw-semibold mw-lg-400px" :class="{'bg-light-primary text-end': message.sender_id === authStore.user?.id, 'bg-light-info text-start': message.sender_id !== authStore.user?.id}">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer pt-4" id="kt_chat_messenger_footer">
      <textarea v-model="newMessage" @keydown.enter.prevent="handleSendMessage" class="form-control form-control-flush mb-3" rows="1" placeholder="Type a message"></textarea>
      <div class="d-flex flex-stack">
        <div class="d-flex align-items-center me-2">
          <button class="btn btn-sm btn-icon btn-active-light-primary me-1" type="button">
            <i class="ki-duotone ki-paper-clip fs-3"></i>
          </button>
        </div>
        <button @click="handleSendMessage" class="btn btn-primary" type="button">Send</button>
      </div>
    </div>
  </div>
  <div v-else class="d-flex flex-column justify-content-center align-items-center h-100">
    <p class="text-muted">Select a conversation to start chatting.</p>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, computed, nextTick } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';

const props = defineProps({
  selectedUser: Object,
});

const authStore = useAuthStore();
const chatStore = useChatStore();
const newMessage = ref('');
const messageContainer = ref(null);

const messages = computed(() => chatStore.messages);

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

const fetchMessages = async (conversationId) => {
  if (!conversationId) return;
  try {
    const response = await axios.get(`http://localhost:3000/api/conversations/${conversationId}/messages`);
    chatStore.messages = response.data;
    scrollToBottom();
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

const handleSendMessage = () => {
  if (!newMessage.value.trim() || !props.selectedUser) return;

  const messageData = {
    conversationId: props.selectedUser.conversationId,
    senderId: authStore.user.id,
    content: newMessage.value,
  };

  chatStore.sendMessage(messageData);
  // Optimistically add the message to the local state for immediate display
  chatStore.messages.push({
    id: Date.now(), // Temporary ID
    conversation_id: props.selectedUser.conversationId,
    sender_id: authStore.user.id,
    content: newMessage.value,
    created_at: new Date().toISOString(),
    sender_name: authStore.user.username, // Include sender_name
  });
  newMessage.value = '';
  scrollToBottom();
};

watch(() => props.selectedUser, (newUser) => {
  if (newUser && newUser.conversationId) {
    fetchMessages(newUser.conversationId);
  } else {
    chatStore.messages = [];
  }
});

watch(messages, () => {
    scrollToBottom();
}, { deep: true });

</script>
