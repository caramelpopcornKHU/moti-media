import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchPosts() {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('http://localhost:3000/api/posts');
      posts.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  function updatePostCommentCount(postId, incrementBy) {
    const post = posts.value.find(p => p.id === postId);
    if (post) {
      post.comment_count = (post.comment_count || 0) + incrementBy;
    }
  }

  function updatePostLikeCount(postId, incrementBy) {
    const post = posts.value.find(p => p.id === postId);
    if (post) {
      post.like_count = (post.like_count || 0) + incrementBy;
    }
  }

  function upsertPost(newPost) {
    const index = posts.value.findIndex(p => p.id === newPost.id);
    if (index !== -1) {
      posts.value[index] = newPost;
    } else {
      posts.value.push(newPost);
    }
  }

  return { posts, loading, error, fetchPosts, updatePostCommentCount, updatePostLikeCount, upsertPost };
});