<template>
  <!--begin::Content wrapper-->
  <div class="d-flex flex-column flex-column-fluid">
    <!--begin::Content-->
    <div id="kt_app_content" class="app-content flex-column-fluid">
      <!--begin::Content container-->
      <div id="kt_app_content_container" class="app-container container-xxl">
        <!--begin::Social feed-->
        <div class="d-flex flex-row">
          <!--begin::Layout-->
          <div class="flex-row-fluid me-lg-15">
            <!--begin::Post content-->
            <div class="mb-10">
              <!--begin::Card-->
              <div class="card card-flush mb-10">
                <!--begin::Card header-->
                <div class="card-header pt-9">
                  <!--begin::Author-->
                  <div class="d-flex align-items-center">
                    <!--begin::Avatar-->
                    <div class="symbol symbol-50px me-5">
                      <img src="/metronic/media/avatars/300-1.jpg" class="" alt="" />
                    </div>
                    <!--end::Avatar-->
                    <!--begin::Info-->
                    <div class="flex-grow-1">
                      <!--begin::Name-->
                      <a href="#" class="text-gray-800 text-hover-primary fs-4 fw-bold">Your Name</a>
                      <!--end::Name-->
                      <!--begin::Date-->
                      <span class="text-gray-500 fw-semibold fs-6">What's on your mind?</span>
                      <!--end::Date-->
                    </div>
                    <!--end::Info-->
                  </div>
                  <!--end::Author-->
                </div>
                <!--end::Card header-->
                <!--begin::Card body-->
                <div class="card-body">
                  <textarea class="form-control form-control-solid mb-3" rows="3" placeholder="Share your thoughts..." v-model="newPostContent"></textarea>
                  <div class="d-flex justify-content-between align-items-center">
                    <button class="btn btn-primary" @click="createPost">Post</button>
                  </div>
                </div>
                <!--end::Card body-->
              </div>
              <!--end::Card-->
            </div>
            <!--end::Post content-->

            <!--begin::Posts-->
            <div class="d-flex flex-column">
              <div v-if="postsStore.loading" class="text-center">Loading posts...</div>
              <div v-else-if="postsStore.error" class="text-center text-danger">Failed to load posts: {{ postsStore.error.message }}</div>
              <div v-else-if="postsStore.posts.length === 0" class="text-center">No posts available.</div>
              <div v-else v-for="post in postsStore.posts" :key="post.id" class="card card-flush mb-10">
                <!--begin::Card header-->
                <div class="card-header pt-9">
                  <!--begin::Author-->
                  <div class="d-flex align-items-center">
                    <!--begin::Avatar-->
                    <div class="symbol symbol-50px me-5">
                      <img :src="`/metronic/media/avatars/300-${post.id % 20 + 1}.jpg`" class="" alt="" />
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
                  <!--begin::Card toolbar-->
                  <div class="card-toolbar">
                    <!--begin::Menu wrapper-->
                    <div class="m-0">
                      <!--begin::Menu toggle-->
                      <button class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                        <i class="ki-duotone ki-category fs-6">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                          <span class="path4"></span>
                        </i>
                      </button>
                      <!--end::Menu toggle-->
                      <!--begin::Menu-->
                      <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px" data-kt-menu="true">
                        <!--begin::Menu item-->
                        <div class="menu-item px-3">
                          <div class="menu-content fs-6 text-gray-900 fw-bold px-3 py-4">Quick Actions</div>
                        </div>
                        <!--end::Menu item-->
                        <!--begin::Menu separator-->
                        <div class="separator mb-3 opacity-75"></div>
                        <!--end::Menu separator-->
                        <!--begin::Menu item-->
                        <div class="menu-item px-3">
                          <a href="#" class="menu-link px-3">New Ticket</a>
                        </div>
                        <!--end::Menu item-->
                        <!--begin::Menu item-->
                        <div class="menu-item px-3" data-kt-menu-trigger="hover" data-kt-menu-placement="right-start">
                          <!--begin::Menu item-->
                          <a href="#" class="menu-link px-3">
                            <span class="menu-title">New Group</span>
                            <span class="menu-arrow"></span>
                          </a>
                          <!--end::Menu item-->
                          <!--begin::Menu sub-->
                          <div class="menu-sub menu-sub-dropdown w-175px py-4">
                            <!--begin::Menu item-->
                            <div class="menu-item px-3">
                              <a href="#" class="menu-link px-3">Admin Group</a>
                            </div>
                            <!--end::Menu item-->
                            <!--begin::Menu item-->
                            <div class="menu-item px-3">
                              <a href="#" class="menu-link px-3">Staff Group</a>
                            </div>
                            <!--end::Menu item-->
                            <!--begin::Menu item-->
                            <div class="menu-item px-3">
                              <a href="#" class="menu-link px-3">Member Group</a>
                            </div>
                            <!--end::Menu item-->
                          </div>
                          <!--end::Menu sub-->
                        </div>
                        <!--end::Menu item-->
                        <!--begin::Menu item-->
                        <div class="menu-item px-3">
                          <a href="#" class="menu-link px-3">New Contact</a>
                        </div>
                        <!--end::Menu item-->
                        <!--begin::Menu separator-->
                        <div class="separator mt-3 opacity-75"></div>
                        <!--end::Menu separator-->
                        <!--begin::Menu item-->
                        <div class="menu-item px-3">
                          <div class="menu-content px-3 py-3">
                            <a class="btn btn-primary btn-sm px-4" href="#">Generate Reports</a>
                          </div>
                        </div>
                        <!--end::Menu item-->
                      </div>
                      <!--end::Menu-->
                    </div>
                    <!--end::Menu wrapper-->
                  </div>
                  <!--end::Card toolbar-->
                </div>
                <!--end::Card header-->
                <!--begin::Card body-->
                <div class="card-body">
                  <!--begin::Post content-->
                  <div class="fs-6 fw-normal text-gray-700">{{ post.content }}</div>
                  <!--end::Post content-->
                  <!--begin::Post media-->
                  <div v-if="post.image" class="py-4">
                    <a class="d-block overlay" data-fslightbox="lightbox-hot-sales" :href="post.image">
                      <!--begin::Image-->
                      <div class="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded min-h-300px" :style="`background-image:url('${post.image}')`"></div>
                      <!--end::Image-->
                      <!--begin::Action-->
                      <div class="overlay-layer card-rounded bg-dark bg-opacity-25">
                        <i class="ki-duotone ki-eye fs-3x text-white">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                      </div>
                      <!--end::Action-->
                    </a>
                  </div>
                  <!--end::Post media-->
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
                    </i>{{ post.comment_count || 0 }}</router-link>
                  <!--end::Action-->
                  <!--begin::Action-->
                  <button
                    :class="[post.hasLiked ? 'btn-success' : 'btn-light-danger', 'btn', 'btn-sm', 'btn-color-muted', 'px-4', 'py-2', 'ms-2']"
                    @click="post.hasLiked ? removeLike(post.id) : addLike(post.id)"
                  >
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
            <!--end::Posts-->

            <!--begin::Pagination-->
            <div class="d-flex flex-stack flex-wrap">
              <div class="fs-6 fw-semibold text-gray-700">Showing {{ postsStore.posts.length > 0 ? 1 : 0 }} to {{ postsStore.posts.length }} of {{ postsStore.posts.length }} entries</div>
              <!--begin::Pages-->
              <ul class="pagination">
                <li class="page-item previous disabled">
                  <a href="#" class="page-link">
                    <i class="previous"></i>
                  </a>
                </li>
                <li class="page-item active">
                  <a href="#" class="page-link">1</a>
                </li>
                <li class="page-item next disabled">
                  <a href="#" class="page-link">
                    <i class="next"></i>
                  </a>
                </li>
              </ul>
              <!--end::Pages-->
            </div>
            <!--end::Pagination-->
          </div>
          <!--end::Layout-->

          <!--begin::Sidebar-->
          <div class="flex-column-fluid d-none d-lg-block" style="width: 300px;">
            <!--begin::Engage widget 1-->
            <div class="card" style="background-image: url('/metronic/media/svg/shapes/abstract-2.svg'); background-position: right top; background-size: 30% auto; background-repeat: no-repeat;">
              <!--begin::Body-->
              <div class="card-body d-flex flex-column flex-center">
                <!--begin::Heading-->
                <div class="mb-2">
                  <!--begin::Title-->
                  <h1 class="fw-semibold text-gray-800 text-center lh-lg">Have your own
                    <br />
                    <span class="fw-bolder">Nice Idea?</span></h1>
                  <!--end::Title-->
                  <!--begin::Illustration-->
                  <div class="py-10 text-center">
                    <img src="/metronic/media/svg/illustrations/easy/2.svg" alt="" class="w-200px" />
                  </div>
                  <!--end::Illustration-->
                </div>
                <!--end::Heading-->
                <!--begin::Links-->
                <div class="text-center mb-1">
                  <!--begin::Link-->
                  <router-link to="/my-projects" class="btn btn-sm btn-primary me-2">My Projects</router-link>
                  <!--end::Link-->
                  <!--begin::Link-->
                  <router-link to="/new-project" class="btn btn-sm btn-light">New Project</router-link>
                  <!--end::Link-->
                </div>
                <!--end::Links-->
              </div>
              <!--end::Body-->
            </div>
            <!--end::Engage widget 1-->
            <!--begin::Popular posts-->
            <div class="card card-flush mt-10">
              <!--begin::Header-->
              <div class="card-header pt-9">
                <!--begin::Title-->
                <h3 class="card-title align-items-start flex-column">
                  <span class="card-label fw-bold text-gray-800">Popular Posts</span>
                  <span class="text-gray-500 mt-1 fw-semibold fs-6">8k views and 40 comments</span>
                </h3>
                <!--end::Title-->
                <!--begin::Toolbar-->
                <div class="card-toolbar">
                  <a href="#" class="btn btn-sm btn-light">View All</a>
                </div>
                <!--end::Toolbar-->
              </div>
              <!--end::Header-->
              <!--begin::Body-->
              <div class="card-body pt-6">
                <!--begin::Item-->
                <div class="d-flex flex-stack">
                  <!--begin::Symbol-->
                  <div class="symbol symbol-60px symbol-2by3 me-4">
                    <div class="symbol-label" style="background-image: url('/metronic/media/stock/600x400/img-1.jpg')"></div>
                  </div>
                  <!--end::Symbol-->
                  <!--begin::Content-->
                  <div class="d-flex align-items-center flex-row-fluid flex-wrap">
                    <!--begin::Info-->
                    <div class="flex-grow-1 me-2">
                      <a href="#" class="text-gray-800 text-hover-primary fs-6 fw-bold">Cup of Coffee</a>
                      <span class="text-muted fw-semibold d-block fs-7">15 minutes ago</span>
                    </div>
                    <!--end::Info-->
                    <!--begin::Action-->
                    <a href="#" class="btn btn-sm btn-icon btn-light btn-active-light-primary">
                      <i class="ki-duotone ki-arrow-right fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </a>
                    <!--end::Action-->
                  </div>
                  <!--end::Content-->
                </div>
                <!--end::Item-->
                <!--begin::Separator-->
                <div class="separator separator-dashed my-6"></div>
                <!--end::Separator-->
                <!--begin::Item-->
                <div class="d-flex flex-stack">
                  <!--begin::Symbol-->
                  <div class="symbol symbol-60px symbol-2by3 me-4">
                    <div class="symbol-label" style="background-image: url('/metronic/media/stock/600x400/img-2.jpg')"></div>
                  </div>
                  <!--end::Symbol-->
                  <!--begin::Content-->
                  <div class="d-flex align-items-center flex-row-fluid flex-wrap">
                    <!--begin::Info-->
                    <div class="flex-grow-1 me-2">
                      <a href="#" class="text-gray-800 text-hover-primary fs-6 fw-bold">Workplace Report</a>
                      <span class="text-muted fw-semibold d-block fs-7">2 days ago</span>
                    </div>
                    <!--end::Info-->
                    <!--begin::Action-->
                    <a href="#" class="btn btn-sm btn-icon btn-light btn-active-light-primary">
                      <i class="ki-duotone ki-arrow-right fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </a>
                    <!--end::Action-->
                  </div>
                  <!--end::Content-->
                </div>
                <!--end::Item-->
                <!--begin::Separator-->
                <div class="separator separator-dashed my-6"></div>
                <!--end::Separator-->
                <!--begin::Item-->
                <div class="d-flex flex-stack">
                  <!--begin::Symbol-->
                  <div class="symbol symbol-60px symbol-2by3 me-4">
                    <div class="symbol-label" style="background-image: url('/metronic/media/stock/600x400/img-3.jpg')"></div>
                  </div>
                  <!--end::Symbol-->
                  <!--begin::Content-->
                  <div class="d-flex align-items-center flex-row-fluid flex-wrap">
                    <!--begin::Info-->
                    <div class="flex-grow-1 me-2">
                      <a href="#" class="text-gray-800 text-hover-primary fs-6 fw-bold">Business Trip</a>
                      <span class="text-muted fw-semibold d-block fs-7">3 weeks ago</span>
                    </div>
                    <!--end::Info-->
                    <!--begin::Action-->
                    <a href="#" class="btn btn-sm btn-icon btn-light btn-active-light-primary">
                      <i class="ki-duotone ki-arrow-right fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </a>
                    <!--end::Action-->
                  </div>
                  <!--end::Content-->
                </div>
                <!--end::Item-->
                <!--begin::Separator-->
                <div class="separator separator-dashed my-6"></div>
                <!--end::Separator-->
                <!--begin::Item-->
                <div class="d-flex flex-stack">
                  <!--begin::Symbol-->
                  <div class="symbol symbol-60px symbol-2by3 me-4">
                    <div class="symbol-label" style="background-image: url('/metronic/media/stock/600x400/img-4.jpg')"></div>
                  </div>
                  <!--end::Symbol-->
                  <!--begin::Content-->
                  <div class="d-flex align-items-center flex-row-fluid flex-wrap">
                    <!--begin::Info-->
                    <div class="flex-grow-1 me-2">
                      <a href="#" class="text-gray-800 text-hover-primary fs-6 fw-bold">Successful Project</a>
                      <span class="text-muted fw-semibold d-block fs-7">1 month ago</span>
                    </div>
                    <!--end::Info-->
                    <!--begin::Action-->
                    <a href="#" class="btn btn-sm btn-icon btn-light btn-active-light-primary">
                      <i class="ki-duotone ki-arrow-right fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </a>
                    <!--end::Action-->
                  </div>
                  <!--end::Content-->
                </div>
                <!--end::Item-->
              </div>
              <!--end::Body-->
            </div>
            <!--end::Popular posts-->
          </div>
          <!--end::Sidebar-->
        </div>
        <!--end::Social feed-->
      </div>
      <!--end::Content container-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Content wrapper-->
</template>

<script>
import axios from 'axios';
import { usePostsStore } from '../stores/posts';

export default {
  name: 'BlogHomeView',
  setup() {
    const postsStore = usePostsStore();
    return { postsStore };
  },
  data() {
    return {
      newPostContent: '',
    };
  },
  mounted() {
    this.postsStore.fetchPosts();
  },
  methods: {
    async createPost() {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        alert('You must be logged in to create a post.');
        this.$router.push('/sign-in');
        return;
      }

      if (!this.newPostContent.trim()) {
        alert('Post content cannot be empty.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/api/posts', {
          user_id: userId,
          title: 'New Post', // You might want to add a title input field later
          content: this.newPostContent,
        });
        console.log('Post created:', response.data);
        this.newPostContent = ''; // Clear the input field
        await this.postsStore.fetchPosts(); // Refresh the posts list using the store
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post.');
      }
    },
    async addLike(postId) {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        alert("Please log in to like this post.");
        return;
      }

      try {
        await axios.post(`http://localhost:3000/api/posts/${postId}/likes`, { user_id: userId });
        this.postsStore.updatePostLikeCount(postId, 1); // Update like count in store
        // Update hasLiked status for the specific post in the store
        const post = this.postsStore.posts.find(p => p.id === postId);
        if (post) {
          post.hasLiked = true;
        }
      } catch (error) {
        console.error('Error adding like:', error);
        if (error.response && error.response.status === 409) {
          alert("You have already liked this post.");
        } else {
          alert("Failed to like post.");
        }
      }
    },
    async removeLike(postId) {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        alert("Please log in to unlike this post.");
        return;
      }

      try {
        await axios.delete(`http://localhost:3000/api/posts/${postId}/likes`, { data: { user_id: userId } });
        this.postsStore.updatePostLikeCount(postId, -1); // Update like count in store
        // Update hasLiked status for the specific post in the store
        const post = this.postsStore.posts.find(p => p.id === postId);
        if (post) {
          post.hasLiked = false;
        }
      } catch (error) {
        console.error('Error removing like:', error);
        if (error.response && error.response.status === 404) {
          alert("You have not liked this post.");
        } else {
          alert("Failed to unlike post.");
        }
      }
    },
    async checkLikeStatusForPost(postId) {
      const userId = localStorage.getItem('user_id');
      if (!userId) return false;

      try {
        const response = await axios.get(`http://localhost:3000/api/posts/${postId}/likes/status?user_id=${userId}`);
        return response.data.liked;
      } catch (error) {
        console.error(`Error checking like status for post ${postId}:`, error);
        return false;
      }
    },
  },
  watch: {
    'postsStore.posts': {
      async handler(newPosts) {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          for (const post of newPosts) {
            // Only check if hasLiked is not already set (to avoid unnecessary API calls)
            if (typeof post.hasLiked === 'undefined') {
              post.hasLiked = await this.checkLikeStatusForPost(post.id);
            }
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>