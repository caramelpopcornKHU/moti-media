<template>
  <!--begin::Header-->
  <div id="kt_app_header" class="app-header">
    <!--begin::Header container-->
    <div class="app-container container-xxl d-flex align-items-stretch justify-content-between" id="kt_app_header_container">
      <!--begin::Logo-->
      <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15">
        <router-link to="/">
          <img alt="Logo" src="/metronic/media/logos/default-dark.svg" class="h-20px h-lg-30px app-sidebar-logo-default" />
        </router-link>
      </div>
      <!--end::Logo-->
      <!--begin::Header wrapper-->
      <div class="d-flex align-items-stretch justify-content-between flex-lg-grow-1" id="kt_app_header_wrapper">
        <!--begin::Menu wrapper-->
        <div class="app-header-menu app-header-mobile-drawer align-items-stretch" data-kt-drawer="true" data-kt-drawer-name="app-header-menu" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="250px" data-kt-drawer-direction="end" data-kt-drawer-toggle="#kt_app_header_menu_toggle" data-kt-swapper="true" data-kt-swapper-mode="{default: 'append', lg: 'prepend'}" data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}">
          <!--begin::Menu-->
          <div class="menu menu-rounded menu-column menu-lg-row my-5 my-lg-0 align-items-stretch fw-semibold px-2 px-lg-0" id="kt_app_header_menu" data-kt-menu="true">
            <div class="menu-item me-0 me-lg-2" v-if="authStore.isLoggedIn">
              <router-link to="/my-projects" class="menu-link">
                <span class="menu-title">My Projects</span>
              </router-link>
            </div>
            <div class="menu-item me-0 me-lg-2" v-if="authStore.isLoggedIn">
              <router-link to="/chat" class="menu-link">
                <span class="menu-title">Chat</span>
              </router-link>
            </div>
          </div>
          <!--end::Menu-->
        </div>
        <!--end::Menu wrapper-->

        <!--begin::Navbar-->
        <div class="app-navbar flex-shrink-0">
          <!--begin::User menu-->
          <div class="app-navbar-item ms-1 ms-md-3" id="kt_header_user_menu_toggle" v-if="authStore.isLoggedIn">
            <!--begin::Menu wrapper-->
            <div class="cursor-pointer symbol symbol-30px symbol-md-40px" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
              <img :src="authStore.user?.profile_image_url || '/metronic/media/avatars/blank.png'" alt="user" />
            </div>
            <!--begin::User account menu-->
            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px" data-kt-menu="true">
              <!--begin::Menu item-->
              <div class="menu-item px-3">
                <div class="menu-content d-flex align-items-center px-3">
                  <!--begin::Avatar-->
                  <div class="symbol symbol-50px me-5">
                    <img alt="Logo" :src="authStore.user?.profile_image_url || '/metronic/media/avatars/blank.png'" />
                  </div>
                  <!--end::Avatar-->
                  <!--begin::Username-->
                  <div class="d-flex flex-column">
                    <div class="fw-bold d-flex align-items-center fs-5">{{ authStore.user?.username }}
                    <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">Pro</span></div>
                    <a href="#" class="fw-semibold text-muted text-hover-primary fs-7">{{ authStore.user?.email }}</a>
                  </div>
                  <!--end::Username-->
                </div>
              </div>
              <!--end::Menu item-->
              <!--begin::Menu separator-->
              <div class="separator my-2"></div>
              <!--end::Menu separator-->
              <!--begin::Menu item-->
              <div class="menu-item px-5">
                <router-link :to="`/profile/${currentUserId}`" class="menu-link px-5">My Profile</router-link>
              </div>
              <!--end::Menu item-->
              <!--begin::Menu item-->
              <div class="menu-item px-5">
                <router-link to="/my-projects" class="menu-link px-5">
                  <span class="menu-text">My Projects</span>
                </router-link>
              </div>
              <!--end::Menu item-->
              <!--begin::Menu item-->
              <div class="menu-item px-5">
                <a @click="logout" href="#" class="menu-link px-5">Sign Out</a>
              </div>
              <!--end::Menu item-->
            </div>
            <!--end::User account menu-->
            <!--end::Menu wrapper-->
          </div>

          <div class="app-navbar-item ms-1 ms-md-3" v-else>
            <router-link to="/sign-in" class="btn btn-sm btn-light-primary">
              Sign In
            </router-link>
          </div>
          <!--end::User menu-->
        </div>
        <!--end::Navbar-->
      </div>
      <!--end::Header wrapper-->
    </div>
    <!--end::Header container-->
  </div>
  <!--end::Header-->
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref, watch, onMounted, onUpdated, nextTick, computed } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

// currentUserId를 computed 속성으로 변경하여 authStore.user의 변화에 반응하도록 합니다.
const currentUserId = computed(() => authStore.user?.id);

const reinitializeMenus = () => {
  nextTick(() => {
    if (window.KTMenu) {
      window.KTMenu.init();
    }
  });
};

watch(() => authStore.isLoggedIn, (newVal) => {
  reinitializeMenus();
});

onMounted(() => {
  reinitializeMenus();
});

onUpdated(() => {
  reinitializeMenus();
});

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
/* Metronic styles will be used, so no custom styles needed here unless for specific overrides */
</style>
