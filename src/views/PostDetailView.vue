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
              <div id="kt_app_content_container" class="app-container container-fluid">
                <div class="card mb-5 mb-xl-10">
                  <div class="card-body pt-9 pb-0">
                    <div v-if="post">
                      <h1 class="fw-bold text-gray-900 mb-3">{{ post.title }}</h1>
                      <p class="text-muted">By {{ post.username }} on {{ new Date(post.created_at).toLocaleDateString()
                        }}</p>
                      <div class="d-flex align-items-center mb-5">
                        <span class="badge badge-light-primary me-2">Likes: {{ post.like_count }}</span>
                        <button v-if="!hasLiked" @click="addLike"
                          class="btn btn-sm btn-light-success me-2">Like</button>
                        <button v-else @click="removeLike" class="btn btn-sm btn-success me-2">Unlike</button>
                      </div>
                      <div class="fs-5 text-gray-800 mb-5">
                        {{ post.content }}
                      </div>
                      <!-- TODO: Add comments section here -->
                      <div class="separator separator-dashed my-5"></div>
                      <h3 class="fw-bold text-gray-900 mb-3">Comments</h3>
                      <div v-if="comments.length === 0" class="text-muted mb-5">No comments yet.</div>
                      <div v-for="comment in comments" :key="comment.id" class="mb-4">
                        <div class="d-flex align-items-center mb-2">
                          <div class="symbol symbol-35px symbol-circle me-3">
                            <span class="symbol-label bg-light-primary text-primary fw-bold">{{
                              comment.username.charAt(0).toUpperCase() }}</span>
                          </div>
                          <div class="d-flex flex-column">
                            <span class="text-gray-800 fw-bold fs-6">{{ comment.username }}</span>
                            <span class="text-muted fs-7">{{ new Date(comment.created_at).toLocaleString() }}</span>
                          </div>
                        </div>
                        <p class="text-gray-700 ms-10">{{ comment.content }}</p>
                      </div>

                      <div class="card mt-5">
                        <div class="card-body">
                          <h4 class="card-title mb-3">Add a Comment</h4>
                          <form @submit.prevent="addComment">
                            <div class="mb-3">
                              <textarea class="form-control" rows="3" placeholder="Write a comment..."
                                v-model="newCommentContent" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit Comment</button>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center text-muted">
                      Loading post...
                    </div>
                  </div>
                </div>
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
  name: 'PostDetailView',
  setup() {
    const postsStore = usePostsStore();
    return { postsStore };
  },
  data() {
    return {
      post: null,
      comments: [],
      newCommentContent: '',
      hasLiked: false,
    };
  },
  created() {
    this.fetchPostDetail();
    this.fetchComments();
    this.checkLikeStatus();
  },
  methods: {
    /*
    async fetchPostDetail() {
      const postId = parseInt(this.$route.params.id);
      try {
        const response = await axios.get(`http://localhost:3000/api/posts/${postId}`);
        this.post = response.data; // Directly assign the fetched post
        this.postsStore.upsertPost(response.data); // Add/update post in the store for consistency
      } catch (error) {
        console.error('Error fetching post detail:', error);
        alert("Failed to load post.");
        // If fetching fails, try to get from store if it exists (fallback)
        const postFromStore = this.postsStore.posts.find(p => p.id === postId);
        if (postFromStore) {
          this.post = postFromStore;
        }
      }
    }*/
    async fetchPostDetail() {
      const postId = parseInt(this.$route.params.id);
      try {
        const response = await axios.get(`http://localhost:3000/api/posts/${postId}`);
        this.post = response.data;
        this.postsStore.upsertPost(response.data);
      } catch (error) {
        console.error('Error fetching post detail:', error);
        // fallback
        const postFromStore = this.postsStore.posts.find(p => p.id === postId);
        if (postFromStore) {
          this.post = postFromStore;
          console.warn("Loaded post from store fallback.");
        } else {
          alert("Failed to load post."); // ✅ fallback도 실패했을 때만 띄움
        }
      }
    }

    ,
    async fetchComments() {
      const postId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/posts/${postId}/comments`);
        this.comments = response.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async addComment() {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        alert("Please log in to add a comment.");
        return;
      }
      if (!this.newCommentContent.trim()) {
        alert("Comment cannot be empty.");
        return;
      }

      const postId = parseInt(this.$route.params.id);
      try {
        await axios.post(`http://localhost:3000/api/posts/${postId}/comments`, {
          user_id: userId,
          content: this.newCommentContent,
        });
        this.newCommentContent = '';
        await this.fetchComments(); // Refresh comments after adding a new one
        this.postsStore.updatePostCommentCount(postId, 1); // Update comment count in store
      } catch (error) {
        console.error('Error adding comment:', error);
        alert("Failed to add comment.");
      }
    },
    async checkLikeStatus() {
      const userId = localStorage.getItem('user_id');
      console.log('checkLikeStatus - userId:', userId);
      if (!userId) return;

      const postId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/posts/${postId}/likes/status?user_id=${userId}`);
        this.hasLiked = response.data.liked;
        console.log('checkLikeStatus - hasLiked:', this.hasLiked);
      } catch (error) {
        console.error('Error checking like status:', error);
        this.hasLiked = false;
      }
    },
    async addLike() {
      const userId = localStorage.getItem('user_id');
      console.log('addLike - userId:', userId);
      if (!userId) {
        alert("Please log in to like this post.");
        return;
      }

      const postId = parseInt(this.$route.params.id);
      try {
        const response = await axios.post(`http://localhost:3000/api/posts/${postId}/likes`, { user_id: userId });
        console.log('addLike - API response:', response.data);
        this.hasLiked = true;
        this.postsStore.updatePostLikeCount(postId, 1); // Update like count in store
      } catch (error) {
        console.error('Error adding like:', error);
        if (error.response && error.response.status === 409) {
          alert("You have already liked this post.");
        } else {
          alert("Failed to like post.");
        }
      }
    },
    async removeLike() {
      const userId = localStorage.getItem('user_id');
      console.log('removeLike - userId:', userId);
      if (!userId) {
        alert("Please log in to unlike this post.");
        return;
      }

      const postId = parseInt(this.$route.params.id);
      try {
        const response = await axios.delete(`http://localhost:3000/api/posts/${postId}/likes`, { data: { user_id: userId } });
        console.log('removeLike - API response:', response.data);
        this.hasLiked = false;
        this.postsStore.updatePostLikeCount(postId, -1); // Update like count in store
      } catch (error) {
        console.error('Error removing like:', error);
        if (error.response && error.response.status === 404) {
          alert("You have not liked this post."); // Corrected message
        } else {
          alert("Failed to unlike post.");
        }
      }
    },
  },
};
</script>