import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const user = ref(null); // Add user state

  // Initialize from localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      isLoggedIn.value = true;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem('user');
    }
  }

  function login(userData) {
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

  return { isLoggedIn, user, login, logout };
});
