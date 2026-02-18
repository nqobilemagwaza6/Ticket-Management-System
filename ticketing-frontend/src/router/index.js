// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Auth
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'

// Layout
import MainLayout from '@/layouts/MainLayout.vue'


// User/Admin/Support Views
import UserDashboardView from '@/views/User/UserDashboardView.vue'
import CreateTicketView from '@/views/User/CreateTicketView.vue'
import TicketListView from '@/views/User/TicketListView.vue'
import TicketDetailView from '@/views/User/TicketDetailView.vue'
import AdminDashboard from '@/views/Admin/AdminDashboard.vue'
import SupportDashboard from '@/views/Support/SupportDashBoard.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminUsersView from '@/views/Admin/AdminUsersView.vue'
import AdminAgentsView from '@/views/Admin/AdminAgentsView.vue'
import AdminTicketsView from '@/views/Admin/AdminTicketsView.vue'

const routes = [
  // Public
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
  { path: '/reset-password/:uid/:token', name: 'ResetPassword', component: ResetPasswordView },

  // Employee routes (nested under MainLayout)
  {
    path: '/employee',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'EmployeeDashboard', component: UserDashboardView },
      { path: 'create-ticket', name: 'CreateTicket', component: CreateTicketView },
      { path: 'tickets', name: 'TicketList', component: TicketListView },
      { path: 'tickets/:id', name: 'TicketDetail', component: TicketDetailView, props: true }
    ]
  },

  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
       { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'users', name: 'AdminUsers', component: AdminUsersView },
      { path: 'agents', name: 'AdminAgents', component: AdminAgentsView },
      { path: 'tickets', name: 'AdminTickets', component: AdminTicketsView }
     
    ]
  },

  // Support routes
  {
    path: '/support',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'SupportDashboard', component: SupportDashboard }
    ]
  },

  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth helper
function isAuthenticated() {
  const user = localStorage.getItem('user')
  const isAuth = localStorage.getItem('isAuthenticated')
  return !!(user && isAuth === 'true')
}

// ======================
// ROUTE GUARD
// ======================
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.meta.requiresAuth && !authenticated) return next({ name: 'Login' })
  if (to.meta.requiresAdmin && (!authenticated || user.role !== 'admin')) return next({ name: 'Login' })

  // Removed the forced redirect from Login
  next()
})

export default router
