<template>
  <div class="modal fade" id="createPostModal" tabindex="-1" aria-labelledby="createPostModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createPostModalLabel">Create New Post</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createPost">
            <div class="mb-3">
              <label for="postTitle" class="form-label">Title</label>
              <input type="text" class="form-control" id="postTitle" v-model="title" required>
            </div>
            <div class="mb-3">
              <label for="postContent" class="form-label">Content</label>
              <textarea class="form-control" id="postContent" rows="5" v-model="content" required></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Post</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';

export default {
  name: 'CreatePostModal',
  setup() {
    const title = ref('');
    const content = ref('');
    let modalInstance = null; // To store the Bootstrap modal instance

    onMounted(() => {
      const modalElement = document.getElementById('createPostModal');
      if (modalElement && window.bootstrap && window.bootstrap.Modal) {
        modalInstance = new window.bootstrap.Modal(modalElement);
      } else {
        console.error("Bootstrap Modal not found or modal element not available.");
      }
    });

    const createPost = async () => {
      const userId = localStorage.getItem('user_id'); // Get user ID from local storage
      if (!userId) {
        alert("Please log in to create a post.");
        return;
      }

      try {
        await axios.post('http://localhost:3000/api/posts', {
          user_id: userId,
          title: title.value,
          content: content.value,
        });
        alert("Post created successfully!");
        title.value = '';
        content.value = '';
        if (modalInstance) {
          modalInstance.hide();
        }
        // Emit an event to notify parent component (e.g., HomeView) to refresh posts
        // This will be handled by the parent component directly calling fetchPosts
      } catch (error) {
        console.error('Error creating post:', error);
        alert("Failed to create post.");
      }
    };

    // Expose show and hide methods to the parent component
    const show = () => {
      if (modalInstance) {
        modalInstance.show();
      }
    };

    const hide = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
    };

    return {
      title,
      content,
      createPost,
      show,
      hide,
    };
  },
};
</script>
