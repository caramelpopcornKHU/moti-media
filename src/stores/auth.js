import { ref } from 'vue'
import { defineStore } from 'pinia'

const defaultProfileImage = '/metronic/media/avatars/blank.png';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const user = ref(null); // Add user state

  // Initialize from localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      if (!userData.profile_image_url) {
        userData.profile_image_url = defaultProfileImage;
      }
      user.value = userData;
      isLoggedIn.value = true;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem('user');
    }
  }

  function login(userData) {
    if (!userData.profile_image_url) {
      userData.profile_image_url = defaultProfileImage;
    }
    isLoggedIn.value = true;
    user.value = userData; // Store user data
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function logout() {
    isLoggedIn.value = false;
    user.value = null; // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('user_id'); // Ensure old user_id is cleared
    localStorage.removeItem('username'); // Ensure old username is cleared
  }

  function updateUserProfileImage(newImageUrl) {
    if (user.value) {
      user.value.profile_image_url = newImageUrl;
      localStorage.setItem('user', JSON.stringify(user.value));
    }
  }

  return { isLoggedIn, user, login, logout, updateUserProfileImage };
});
