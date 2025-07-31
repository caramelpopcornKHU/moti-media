import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogHomeView from '../views/BlogHomeView.vue'
import SignUpView from '../views/SignUpView.vue'
import ChatView from '../views/ChatView.vue' // Import ChatView
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/posts',
      name: 'posts',
      component: BlogHomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpView,
      meta: { guest: true } // Add meta field for guest routes
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/SignInView.vue'),
      meta: { guest: true } // Add meta field for guest routes
    },
    {
      path: '/profile/:id',
      name: 'user-profile',
      component: () => import('../views/UserProfileView.vue'),
    },
    {
      path: '/posts/:id',
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
    },
    {
      path: '/my-projects',
      name: 'my-projects',
      component: () => import('../views/MyProjectsView.vue'),
    },
    {
      path: '/new-project',
      name: 'new-project',
      component: () => import('../views/NewProjectView.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Redirect unauthenticated users to sign-in page
    next('/sign-in');
  } else if (to.meta.guest && isLoggedIn) {
    // Redirect authenticated users away from guest pages (like sign-in, sign-up)
    next('/posts');
  } else {
    // Allow navigation
    next();
  }
});

export default router
