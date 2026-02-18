<template>
  <div class="app-wrapper">

    <!-- Sidebar -->
    <aside :class="['sidebar', { open: sidebarOpen }]">

      <div class="sidebar-header">
        <h5 class="text-white fw-bold">TMS</h5>
      </div>

      <nav class="nav flex-column mt-4">
       <router-link
  v-for="link in filteredLinks"
  :key="link.name"
  :to="link.path"
  class="nav-link"
>
  <i :class="link.icon + ' me-2'"></i>
  {{ link.label }}
</router-link>

</nav>
  

    </aside>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Header -->
      <AppHeader @toggleSidebar="toggleSidebar" />

      <!-- Page Content -->
      <main class="p-4">
     
       <router-view />

      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

// Sidebar toggle
const sidebarOpen = ref(false)
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

// Current route
const route = useRoute()

// Load current page component dynamically
const currentPageComponent = ref(null)
const routeProps = ref({})

const loadComponent = async () => {
  if (route.name === 'EmployeeDashboard') {
    const module = await import('@/views/User/UserDashboardView.vue')
    currentPageComponent.value = module.default
    routeProps.value = {}
  } else if (route.name === 'CreateTicket') {
    const module = await import('@/views/User/CreateTicketView.vue')
    currentPageComponent.value = module.default
    routeProps.value = {}
  } else if (route.name === 'TicketList') {
    const module = await import('@/views/User/TicketListView.vue')
    currentPageComponent.value = module.default
    routeProps.value = {}
  } else if (route.name === 'TicketDetail') {
    const module = await import('@/views/User/TicketDetailView.vue')
    currentPageComponent.value = module.default
    routeProps.value = route.params
  } else if (route.name === 'AdminDashboard') {
    const module = await import('@/views/Admin/AdminDashboard.vue')
    currentPageComponent.value = module.default
    routeProps.value = {}
  } else if (route.name === 'SupportDashboard') {
    const module = await import('@/views/Support/SupportDashBoard.vue')
    currentPageComponent.value = module.default
    routeProps.value = {}
  } else {
    currentPageComponent.value = null
    routeProps.value = {}
  }
}

// Watch route changes
watch(() => route.name, loadComponent, { immediate: true })

// Sidebar links based on role
const user = JSON.parse(localStorage.getItem('user') || '{}')

const links = [
  // Employee
  { name: 'EmployeeDashboard', label: 'Dashboard', role: 'user', icon: 'bi bi-speedometer2', path: '/employee/dashboard' },
  { name: 'TicketList', label: 'My Tickets', role: 'user', icon: 'bi bi-ticket', path: '/employee/tickets' },
  { name: 'CreateTicket', label: 'Create Ticket', role: 'user', icon: 'bi bi-plus-circle', path: '/employee/create-ticket' },

  // Admin
  { name: 'AdminDashboard', label: 'Dashboard', role: 'admin', icon: 'bi bi-speedometer2', path: '/admin/dashboard' },
  // add other admin links...
]

const filteredLinks = computed(() =>
  links.filter(link => link.role === user.role)
)

</script>

<style scoped>
.app-wrapper {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: #000;
  color: white;
  padding: 20px;
  transition: transform 0.3s ease;
}

.nav-link {
  color: #9ca3af;
  padding: 10px 12px;
  border-radius: 6px;
  text-decoration: none;
  margin-bottom: 8px;
}

.nav-link.router-link-active {
  background: #EB5E28;
  color: white !important;
}

.nav-link:hover {
  background: #1f1f1f;
  color: white;
}

/* Content */
.content-area {
  flex: 1;
  background: #f8f9fa;
}

/* Mobile */
@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    height: 100%;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
