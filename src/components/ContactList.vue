<template>
  <div class="list-group">
    <a href="#" class="list-group-item list-group-item-action" v-for="conversation in conversations" :key="conversation.id" @click.prevent="selectConversation(conversation)">
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">{{ conversation.partner_name }}</h5>
        <small>{{ formatTimestamp(conversation.last_message_timestamp) }}</small>
      </div>
      <p class="mb-1 text-muted">{{ conversation.last_message }}</p>
    </a>
    <p v-if="!conversations.length" class="text-muted">No conversations yet.</p>
  </div>
</template>

<script setup>
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { ref, onMounted, defineEmits, watch } from 'vue';

const conversations = ref([]);
const emits = defineEmits(['select-user']);
const authStore = useAuthStore();

const fetchConversations = async () => {
  console.log('fetchConversations called.');
  const userId = authStore.user?.id;
  console.log('Current userId in fetchConversations:', userId);
  if (!userId) {
    console.log('userId is not available, returning.');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/conversations?userId=${userId}`);
    console.log('ContactList API Response:', response.data);
    conversations.value = response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

const selectConversation = (conversation) => {
  emits('select-user', { id: conversation.partner_id, name: conversation.partner_name, conversationId: conversation.id });
};

const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
};

watch(() => authStore.user?.id, (newUserId) => {
  console.log('authStore.user.id changed to:', newUserId);
  if (newUserId) {
    fetchConversations();
  }
}, { immediate: true });
</script>
