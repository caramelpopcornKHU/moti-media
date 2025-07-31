<template>
  <div class="d-flex flex-column flex-root" id="kt_app_root">
    <!--begin::Authentication - Sign-in -->
    <div class="d-flex flex-column flex-lg-row flex-column-fluid">
      <!--begin::Body-->
      <div class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
        <!--begin::Form-->
        <div class="d-flex flex-center flex-column flex-lg-row-fluid">
          <!--begin::Wrapper-->
          <div class="w-lg-500px p-10">
            <!--begin::Form-->
            <form class="form w-100" novalidate="novalidate" id="kt_sign_in_form" @submit.prevent="onSubmit">
              <!--begin::Heading-->
              <div class="text-center mb-11">
                <!--begin::Title-->
                <h1 class="text-gray-900 fw-bolder mb-3">Sign In</h1>
                <!--end::Title-->
                <!--begin::Subtitle-->
                <div class="text-gray-500 fw-semibold fs-6">Your Social Campaigns</div>
                <!--end::Subtitle=-->
              </div>
              <!--begin::Heading-->
              <!--begin::Input group=-->
              <div class="fv-row mb-8">
                <!--begin::Email-->
                <input type="text" placeholder="Email" name="email" autocomplete="off" class="form-control bg-transparent" v-model="email" />
                <!--end::Email-->
              </div>
              <!--begin::Input group-->
              <div class="fv-row mb-8" data-kt-password-meter="true">
                <!--begin::Wrapper-->
                <div class="mb-1">
                  <!--begin::Input wrapper-->
                  <div class="position-relative mb-3">
                    <input class="form-control bg-transparent" type="password" placeholder="Password" name="password" autocomplete="off" v-model="password" />
                    <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2" data-kt-password-meter-control="visibility">
                      <i class="ki-duotone ki-eye-slash fs-2"></i>
                      <i class="ki-duotone ki-eye fs-2 d-none"></i>
                    </span>
                  </div>
                  <!--end::Input wrapper-->
                </div>
              </div>
              <!--end::Input group=-->
              <!--begin::Submit button-->
              <div class="d-grid mb-10">
                <button type="submit" id="kt_sign_in_submit" class="btn btn-primary">
                  <!--begin::Indicator label-->
                  <span class="indicator-label">Sign In</span>
                  <!--end::Indicator label-->
                  <!--begin::Indicator progress-->
                  <span class="indicator-progress">Please wait...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                  <!--end::Indicator progress-->
                </button>
              </div>
              <!--end::Submit button-->
              <!--begin::Sign up-->
              <div class="text-gray-500 text-center fw-semibold fs-6">Not a Member yet?
                <router-link to="/sign-up" class="link-primary fw-semibold">Sign up</router-link>
              </div>
              <!--end::Sign up-->
            </form>
            <!--end::Form-->
          </div>
          <!--end::Wrapper-->
        </div>
        <!--end::Form-->
      </div>
      <!--end::Body-->
      <!--begin::Aside-->
      <div class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2" style="background-image: url(/metronic/media/misc/auth-bg.png)">
        <!--begin::Content-->
        <div class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
          <!--begin::Logo-->
          <a href="index.html" class="mb-0 mb-lg-12">
            <img alt="Logo" src="/metronic/media/logos/custom-1.png" class="h-60px h-lg-75px" />
          </a>
          <!--end::Logo-->
          <!--begin::Image-->
          <img class="d-none d-lg-block mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20" src="/metronic/media/misc/auth-screens.png" alt="" />
          <!--end::Image-->
        </div>
        <!--end::Content-->
      </div>
      <!--end::Aside-->
    </div>
    <!--end::Authentication - Sign-in-->
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'SignInView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async onSubmit() {
      const authStore = useAuthStore();
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password
        });
        console.log('Login successful:', response.data);
        localStorage.setItem('user_id', response.data.id);
        localStorage.setItem('username', response.data.username);
        authStore.login(response.data); // Pass user data to login action
        this.$router.push('/posts'); // Redirect to posts page after successful login
      } catch (error) {
        console.error('Login failed:', error);
        alert("Login failed. Please check your credentials.");
      }
    }
  }
}
</script>
