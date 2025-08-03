<template>
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Sidebar-->
    <div class="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0">
      <!--begin::Contacts-->
      <div class="card card-flush">
        <!--begin::Card header-->
        <div class="card-header pt-7" id="kt_chat_contacts_header">
          <!--begin::Form-->
          <form class="w-100 position-relative" autocomplete="off">
            <i class="ki-duotone ki-magnifier fs-3 text-gray-500 position-absolute top-50 ms-5 translate-middle-y"><span class="path1"></span><span class="path2"></span></i>
            <input type="text" v-model="searchQuery" @input="searchUsers" class="form-control form-control-solid px-13" name="search" placeholder="Search by username or email..." />
          </form>
          <!--end::Form-->
        </div>
        <!--end::Card header-->
        <!--begin::Card body-->
        <div class="card-body pt-5" id="kt_chat_contacts_body">
          <!--begin::List-->
          <div class="scroll-y me-n5 pe-5 h-200px h-lg-auto" data-kt-scroll="true">
            <div v-show="searchQuery.length > 0">
                <div v-for="user in searchResults" :key="user.id" @click="startConversation(user)" class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                    <div class="d-flex align-items-center">
                        <div class="symbol symbol-45px symbol-circle">
                            <img :src="`/metronic/media/avatars/300-${user.id % 20 + 1}.jpg`" alt=""/>
                        </div>
                        <div class="ms-5">
                            <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">{{ user.username }}</a>
                            <div class="fw-semibold text-muted">{{ user.email }}</div>
                        </div>
                    </div>
                </div>
                 <p v-if="!searchResults.length && searchQuery.length" class="text-muted text-center pt-5">No users found.</p>
            </div>
            <ContactList v-show="searchQuery.length === 0" @select-user="handleSelectUser" />
          </div>
          <!--end::List-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Contacts-->
    </div>
    <!--end::Sidebar-->
    <!--begin::Content-->
    <div class="flex-lg-row-fluid ms-lg-7 ms-xl-10">
      <MessageWindow :selected-user="selectedUser" />
    </div>
    <!--end::Content-->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import axios from 'axios';
import ContactList from '../components/ContactList.vue';
import MessageWindow from '../components/MessageWindow.vue';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';

const selectedUser = ref(null);
const authStore = useAuthStore();
const chatStore = useChatStore();
const searchQuery = ref('');
const searchResults = ref([]);
let searchTimeout = null;

// currentUser를 computed 속성으로 변경하여 authStore.user의 변화에 반응하도록 합니다.
const currentUser = computed(() => authStore.user);

const handleSelectUser = (user) => {
  selectedUser.value = user;
};

const searchUsers = () => {
  console.log('Searching for:', searchQuery.value);
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.length < 2) {
      searchResults.value = [];
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/api/users?search=${searchQuery.value}`);
      console.log('API Response:', response.data);
      searchResults.value = response.data.filter(user => user.id !== currentUser.value?.id);
      console.log('Search results:', searchResults.value);

      // Re-initialize KTScroll after DOM update to prevent errors
      nextTick(() => {
        if (window.KTScroll) {
          console.log('Re-initializing KTScroll components...');
          KTScroll.reinit();
        }
      });
    } catch (error) {
      console.error("Error searching users:", error);
    }
  }, 300);
};

const startConversation = async (user) => {
    if (!currentUser.value || !currentUser.value.id) {
        console.error("Current user or user ID not found");
        return;
    }
    try {
        const response = await axios.post('http://localhost:3000/api/conversations/find-or-create', {
            userId1: currentUser.value.id,
            userId2: user.id
        });
        handleSelectUser({ id: user.id, name: user.username, conversationId: response.data.id });
        searchQuery.value = '';
        searchResults.value = [];
    } catch (error) {
        console.error("Error starting conversation:", error);
    }
};

// currentUser.value.id가 유효해질 때만 chatStore.connect를 호출하도록 watch 훅을 사용합니다.
watch(currentUser, (newVal) => {
  if (newVal?.id) {
    chatStore.connect(newVal.id);
  }
}, { immediate: true }); // 컴포넌트 마운트 시 즉시 실행되도록 immediate: true 설정

onUnmounted(() => {
  chatStore.disconnect();
});
</script>
