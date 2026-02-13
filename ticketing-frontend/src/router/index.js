import { createRouter, createWebHistory } from 'vue-router'

// Import all views
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import PasswordChangeView from '@/views/PasswordChangeView.vue'
import DashboardView from '@/views/DashboardView.vue'

const routes = [
  // Redirect root to login
  { path: '/', redirect: '/login' },

  // ======================
  // Auth Routes
  // ======================

  { 
    path: '/login', 
    name: 'Login',
    component: LoginView 
  },

  { 
    path: '/register', 
    name: 'Register',
    component: RegisterView 
  },

  { 
    path: '/forgot-password', 
    name: 'ForgotPassword',
    component: ForgotPasswordView 
  },

  // ✅ UPDATED ROUTE (IMPORTANT)
  {
    path: '/reset-password/:uid/:token',
    name: 'ResetPassword',
    component: ResetPasswordView,
    props: true
  },

  { 
    path: '/password-change-success', 
    name: 'PasswordChangeSuccess',
    component: PasswordChangeView 
  },

  // ======================
  // Protected Routes
  // ======================

  { 
    path: '/dashboard', 
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ======================
// Navigation Guard
// ======================

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('isAuthenticated')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
