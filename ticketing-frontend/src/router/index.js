import { createRouter, createWebHistory } from 'vue-router'

// Import only the files you have kept
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import AdminDashboard from '@/views/Admin/AdminDashboard.vue'
import UserModal from '@/components/UserModal.vue'
import TicketModal from '@/components/TicketModal.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
  { path: '/reset-password/:uid/:token', name: 'ResetPassword', component: ResetPasswordView },
  { path: '/admin-dashboard', name: 'admin-dashboard', component: AdminDashboard  },
  { path: '/user-modal', name: 'user-modal', component: UserModal  },
  { path: '/ticket-modal', name: 'ticket-modal', component: TicketModal  },
  {
    path: '/employee-dashboard',
    name: 'EmployeeDashboard',
    component: () => import('@/views/User/UserDashboardView.vue'),
    meta: { requiresAuth: true, role: 'user' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('isAuthenticated')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router