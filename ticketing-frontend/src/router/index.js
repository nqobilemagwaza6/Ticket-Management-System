import { createRouter, createWebHistory } from 'vue-router'

// Auth Views
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import SupportDashboard from '@/views/Support/SupportDashBoard.vue'
import AdminDashboard from '@/views/Admin/AdminDashboard.vue'
import UserModal from '@/components/UserModal.vue'
import TicketModal from '@/components/TicketModal.vue'

// User Views
import UserDashboardView from '@/views/User/UserDashboardView.vue'
import CreateTicketView from '@/views/User/CreateTicketView.vue'
import TicketDetailView from '@/views/User/TicketDetailView.vue'

// Layout
const UserLayout = () => import('@/layouts/UserLayout.vue')

const routes = [
  //  Public Auth Routes
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
  { path: '/reset-password/:uid/:token', name: 'ResetPassword', component: ResetPasswordView },
  { path: '/support-dashboard', name: 'support-dashboard', component: SupportDashboard },
  { path: '/admin-dashboard', name: 'admin-dashboard', component: AdminDashboard  },
  { path: '/user-modal', name: 'user-modal', component: UserModal  },
  { path: '/ticket-modal', name: 'ticket-modal', component: TicketModal  },
  {
    path: '/',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'employee-dashboard',
        name: 'EmployeeDashboard',
        component: UserDashboardView
      },
      {
        path: 'create-ticket',
        name: 'CreateTicket',
        component: CreateTicketView
      },
      {
        path: 'tickets',
        name: 'TicketList',
        component: () => import('@/views/User/TicketListView.vue')
      },
      {
        path: 'tickets/:id',
        name: 'TicketDetail',
        component: TicketDetailView,
        props: true
      }
    ]
  },

  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//  Auth Helper
function isAuthenticated() {
  const user = localStorage.getItem('user')
  const isAuth = localStorage.getItem('isAuthenticated')
  return !!(user && isAuth === 'true')
}

//  Route Guard
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()

  if (to.meta.requiresAuth && !authenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authenticated) {
    next({ name: 'EmployeeDashboard' })
  } else {
    next()
  }
})

export default router
