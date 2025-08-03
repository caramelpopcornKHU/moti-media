<template>
  <div class="d-flex flex-column flex-root" id="kt_app_root">
    <!--begin::Page-->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <!--begin::Wrapper-->
      <div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
        <!--begin::Main-->
        <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
          <!--begin::Content wrapper-->
          <div class="d-flex flex-column flex-column-fluid">
            <!--begin::Content-->
            <div id="kt_app_content" class="app-content flex-column-fluid">
              <!--begin::Content container-->
              <div id="kt_app_content_container" class="app-container container-xxl">
                <!--begin::Navbar-->
                <div class="card mb-5 mb-xl-10">
                  <div class="card-body pt-9 pb-0">
                    <!--begin::Details-->
                    <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
                      '''                      <!--begin::Avatar-->
                      <div class="me-7 mb-4">
                        <div class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                          <img :src="userProfile.profile_image_url" alt="image" />
                          <div v-if="isCurrentUserProfile" class="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-body h-20px w-20px">
                            <label for="profile_image_upload" class="btn btn-sm btn-icon btn-active-color-primary p-0">
                              <i class="ki-duotone ki-pencil fs-2">
                                <span class="path1"></span>
                                <span class="path2"></span>
                              </i>
                            </label>
                            <input id="profile_image_upload" type="file" class="d-none" @change="onFileChange">
                          </div>
                        </div>
                      </div>
                      <!--end::Avatar-->''
                      <!--begin::Info-->
                      <div class="flex-grow-1">
                        <!--begin::Title-->
                        <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
                          <!--begin::User-->
                          <div class="d-flex flex-column">
                            <!--begin::Name-->
                            <div class="d-flex align-items-center mb-2">
                              <a href="#" class="text-gray-900 fs-2 fw-bold me-1">{{ userProfile.username }}</a>
                              <a href="#">
                                <i class="ki-duotone ki-verify fs-1 text-primary"></i>
                              </a>
                            </div>
                            <!--end::Name-->
                            <!--begin::Contacts-->
                            <div class="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
                              <a href="#" class="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                                <i class="ki-duotone ki-profile-circle fs-4 me-1"></i>{{ userProfile.passion_type || 'Not set' }}</a>
                              <a href="#" class="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                                <i class="ki-duotone ki-sms fs-4 me-1"></i>{{ userProfile.email }}</a>
                            </div>
                            <!--end::Contacts-->
                          </div>
                          <!--end::User-->
                          <!--begin::Actions-->
                          <div class="d-flex align-items-center w-200px w-sm-300px flex-column mt-3">
                            <div class="d-flex justify-content-end">
                                <div v-if="isCurrentUserProfile" class="me-2">
                                    <button type="button" class="btn btn-sm btn-light me-2" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                        Update Passion Type
                                    </button>
                                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-3" data-kt-menu="true">
                                        <div class="menu-item px-3">
                                            <div class="menu-content text-muted pb-2 px-3 fs-7 text-uppercase">Select Type</div>
                                        </div>
                                        <div v-for="pType in passionTypes" :key="pType" class="menu-item px-3">
                                            <a href="#" @click.prevent="passionType = pType" class="menu-link px-3" :class="{'active': passionType === pType}">{{ pType }}</a>
                                        </div>
                                        <div class="separator my-2"></div>
                                        <div class="menu-item px-3">
                                            <button @click="updatePassionType" class="btn btn-primary btn-sm px-4">Save</button>
                                        </div>
                                    </div>
                                </div>
                                <button v-else-if="!isFollowing" @click="followUser" class="btn btn-sm btn-primary me-2">Follow</button>
                                <button v-else @click="unfollowUser" class="btn btn-sm btn-light me-2">Unfollow</button>
                                <a href="#" class="btn btn-sm btn-primary">Message</a>
                            </div>
                          </div>
                          <!--end::Actions-->
                        </div>
                        <!--end::Title-->
                        <!--begin::Stats-->
                        <div class="d-flex flex-wrap flex-stack">
                          <!--begin::Wrapper-->
                          <div class="d-flex flex-column flex-grow-1 pe-8">
                            <!--begin::Stats-->
                            <div class="d-flex flex-wrap">
                              <!--begin::Stat-->
                              <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                                <!--begin::Number-->
                                <div class="d-flex align-items-center">
                                  <div class="fs-2 fw-bold" data-kt-countup="true" :data-kt-countup-value="userProfile.followers_count">{{ userProfile.followers_count }}</div>
                                </div>
                                <!--end::Number-->
                                <!--begin::Label-->
                                <div class="fw-semibold fs-6 text-gray-500">Followers</div>
                                <!--end::Label-->
                              </div>
                              <!--end::Stat-->
                              <!--begin::Stat-->
                              <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                                <!--begin::Number-->
                                <div class="d-flex align-items-center">
                                  <div class="fs-2 fw-bold" data-kt-countup="true" :data-kt-countup-value="userProfile.following_count">{{ userProfile.following_count }}</div>
                                </div>
                                <!--end::Number-->
                                <!--begin::Label-->
                                <div class="fw-semibold fs-6 text-gray-500">Following</div>
                                <!--end::Label-->
                              </div>
                              <!--end::Stat-->
                              <!--begin::Stat-->
                              <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                                <!--begin::Number-->
                                <div class="d-flex align-items-center">
                                  <div class="fs-2 fw-bold" data-kt-countup="true" data-kt-countup-value="60" data-kt-countup-prefix="%">0</div>
                                </div>
                                <!--end::Number-->
                                <!--begin::Label-->
                                <div class="fw-semibold fs-6 text-gray-500">Success Rate</div>
                                <!--end::Label-->
                              </div>
                              <!--end::Stat-->
                            </div>
                            <!--end::Stats-->
                          </div>
                          <!--end::Wrapper-->
                        </div>
                        <!--end::Stats-->
                      </div>
                      <!--end::Info-->
                    </div>
                    <!--end::Details-->
                    <!--begin::Navs-->
                    <ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
                      <!--begin::Nav item-->
                      <li class="nav-item mt-2">
                        <a class="nav-link text-active-primary ms-0 me-10 py-5 active" href="#">Overview</a>
                      </li>
                      <!--end::Nav item-->
                      <!--begin::Nav item-->
                      <li class="nav-item mt-2">
                        <a class="nav-link text-active-primary ms-0 me-10 py-5" href="#">Settings</a>
                      </li>
                      <!--end::Nav item-->
                    </ul>
                    <!--begin::Navs-->
                  </div>
                </div>
                <!--end::Navbar-->

                <!-- User Posts Section -->
                <div class="card mb-5 mb-xl-10">
                  <div class="card-header border-0 pt-9">
                    <div class="card-title">
                      <h3 class="fw-bold text-gray-900">Posts by {{ userProfile.username }}</h3>
                    </div>
                  </div>
                  <div class="card-body py-0">
                    <div v-if="userPosts.length === 0" class="text-center text-muted py-5">
                      No posts found for this user.
                    </div>
                    <div v-else v-for="post in userPosts" :key="post.id" class="card card-flush mb-10">
                      <!--begin::Card header-->
                      <div class="card-header pt-9">
                        <!--begin::Author-->
                        <div class="d-flex align-items-center">
                          <!--begin::Avatar-->
                          <div class="symbol symbol-50px me-5">
                            <img :src="userProfile.profile_image_url" class="" alt="" />
                          </div>
                          <!--end::Avatar-->
                          <!--begin::Info-->
                          <div class="flex-grow-1">
                            <!--begin::Name-->
                            <a href="#" class="text-gray-800 text-hover-primary fs-4 fw-bold">{{ post.username }}</a>
                            <!--end::Name-->
                            <!--begin::Date-->
                            <span class="text-gray-500 fw-semibold fs-6">{{ new Date(post.created_at).toLocaleDateString() }}</span>
                            <!--end::Date-->
                          </div>
                          <!--end::Info-->
                        </div>
                        <!--end::Author-->
                      </div>
                      <!--end::Card header-->
                      <!--begin::Card body-->
                      <div class="card-body">
                        <!--begin::Post content-->
                        <div class="fs-4 fw-normal text-gray-800 mb-5">{{ post.title }}</div>
                        <div class="fs-6 fw-normal text-gray-700">{{ post.content }}</div>
                        <!--end::Post content-->
                      </div>
                      <!--end::Card body-->
                      <!--begin::Card footer-->
                      <div class="card-footer pt-0">
                        <!--begin::Action-->
                        <router-link :to="`/posts/${post.id}`" class="btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2">
                          <i class="ki-duotone ki-message-text-2 fs-2 me-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                          </i>{{ post.comment_count || 0 }}
                        </router-link>
                        <!--end::Action-->
                        <!--begin::Action-->
                        <button :class="[post.hasLiked ? 'btn-success' : 'btn-light-danger', 'btn', 'btn-sm', 'btn-color-muted', 'px-4', 'py-2', 'ms-2']" @click="toggleLike(post)">
                          <i class="ki-duotone ki-heart fs-2 me-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>{{ post.like_count || 0 }}
                        </button>
                        <!--end::Action-->
                      </div>
                      <!--end::Card footer-->
                    </div>
                  </div>
                </div>
                <!-- End User Posts Section -->

              </div>
              <!--end::Content container-->
            </div>
            <!--end::Content-->
          </div>
          <!--end::Content wrapper-->
        </div>
        <!--end::Main-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Page-->
  </div>
</template>

<script>
import axios from 'axios';
import { usePostsStore } from '../stores/posts';

export default {
  name: 'UserProfileView',
  setup() {
    const postsStore = usePostsStore();
    return { postsStore };
  },
  data() {
    return {
      userProfile: {
        username: '',
        email: '',
        followers_count: 0,
        following_count: 0,
        passion_type: null,
        profile_image_url: '',
      },
      userPosts: [],
      isCurrentUserProfile: false,
      isFollowing: false,
      passionType: null,
      passionTypes: ['Innovator', 'Problem Solver', 'Strategist', 'Analyst', 'Communicator'],
    };
  },
  created() {
    this.fetchUserProfile();
    this.fetchUserPosts();
  },
  methods: {
    async fetchUserProfile() {
      const userId = this.$route.params.id;
      const currentUserId = localStorage.getItem('user_id');
      this.isCurrentUserProfile = parseInt(userId) === parseInt(currentUserId);

      if (!this.isCurrentUserProfile) {
        await this.checkFollowStatus(userId, currentUserId);
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        this.userProfile = response.data;
        this.passionType = response.data.passion_type;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    async updatePassionType() {
        const userId = localStorage.getItem('user_id');
        if (!this.passionType) {
            alert('Please select a passion type.');
            return;
        }
        try {
            await axios.put(`http://localhost:3000/api/users/me/passion-type`, { userId, passionType: this.passionType });
            this.userProfile.passion_type = this.passionType;
            alert('Passion type updated successfully!');
        } catch (error) {
            console.error('Error updating passion type:', error);
            alert('Failed to update passion type.');
        }
    },
    async fetchUserPosts() {
      const userId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}/posts`);
        const posts = response.data;
        const currentUserId = localStorage.getItem('user_id');

        if (currentUserId) {
            for (const post of posts) {
                const likeStatusResponse = await axios.get(`http://localhost:3000/api/posts/${post.id}/likes/status?user_id=${currentUserId}`);
                post.hasLiked = likeStatusResponse.data.liked;
            }
        }
        this.userPosts = posts;
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    },
    async checkFollowStatus(profileUserId, currentUserId) {
      if (!currentUserId) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${profileUserId}/follow/status?follower_id=${currentUserId}`);
        this.isFollowing = response.data.isFollowing;
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    },
    async followUser() {
      const profileUserId = this.$route.params.id;
      const currentUserId = localStorage.getItem('user_id');
      if (!currentUserId) return alert('Please log in to follow.');
      try {
        await axios.post(`http://localhost:3000/api/users/${profileUserId}/follow`, { follower_id: currentUserId });
        this.isFollowing = true;
        this.userProfile.followers_count++;
      } catch (error) {
        console.error('Error following user:', error);
      }
    },
    async unfollowUser() {
      const profileUserId = this.$route.params.id;
      const currentUserId = localStorage.getItem('user_id');
      if (!currentUserId) return;
      try {
        await axios.delete(`http://localhost:3000/api/users/${profileUserId}/follow`, { data: { follower_id: currentUserId } });
        this.isFollowing = false;
        this.userProfile.followers_count--;
      } catch (error) {
        console.error('Error unfollowing user:', error);
      }
    },
    async addLike(postId) {
      // This functionality is now handled within the post components themselves or a centralized store.
      // This method can be simplified or removed if not directly used here.
    },
    async removeLike(postId) {
      // This functionality is now handled within the post components themselves or a centralized store.
      // This method can be simplified or removed if not directly used here.
    },
    async toggleLike(post) {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        alert("Please log in to like posts.");
        return;
      }

      const hasLiked = post.hasLiked;
      try {
        if (hasLiked) {
          await axios.delete(`http://localhost:3000/api/posts/${post.id}/likes`, { data: { user_id: userId } });
          post.like_count--;
        } else {
          await axios.post(`http://localhost:3000/api/posts/${post.id}/likes`, { user_id: userId });
          post.like_count++;
        }
        post.hasLiked = !hasLiked;
      } catch (error) {
        console.error('Error toggling like:', error);
        alert('Failed to update like status.');
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('profile_image', file);

      const userId = localStorage.getItem('user_id');
      axios.post(`http://localhost:3000/api/users/${userId}/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        this.userProfile.profile_image_url = response.data.profile_image_url;
        const authStore = useAuthStore();
        authStore.updateUserProfileImage(response.data.profile_image_url);
        alert('Profile image updated successfully!');
      }).catch(error => {
        console.error('Error uploading profile image:', error);
        alert('Failed to update profile image.');
      });
    }
  },
};
</script>
