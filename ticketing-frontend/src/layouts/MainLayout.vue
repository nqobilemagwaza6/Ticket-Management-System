<template>
  <div class="app-wrapper">
    <!-- Sidebar -->
    <aside :class="['sidebar', { open: sidebarOpen }]">
      <div class="sidebar-header d-flex justify-content-between align-items-center">
        <h5 class="text-white fw-bold mb-0">TMS</h5>
        <button @click="toggleSidebar" class="btn btn-sm btn-dark d-lg-none">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <nav class="nav flex-column mt-4">
        <router-link
          v-for="link in filteredLinks"
          :key="link.name"
          :to="link.path"
          class="nav-link"
          @click="closeSidebarOnMobile"
        >
          <i :class="link.icon + ' me-2'"></i>
          {{ link.label }}
        </router-link>
      </nav>

      <!-- Optional user info footer -->
      <div v-if="user.name" class="sidebar-footer mt-auto pt-4">
        <div class="d-flex align-items-center text-white-50">
          <div class="avatar-circle me-2" :class="'bg-' + getAvatarColor">
            {{ userInitials }}
          </div>
          <div class="small">
            <div class="fw-bold text-white">{{ userName }}</div>
            <div>{{ userRole }}</div>
          </div>
        </div>
      </div>
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

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" class="sidebar-overlay d-lg-none" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebarOnMobile() {
  if (window.innerWidth < 992) {
    sidebarOpen.value = false
  }
}

// Current route
const route = useRoute()

// Get user data
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => user.name || 'User')
const userRole = computed(() => {
  const role = user.role || 'user'
  return role.charAt(0).toUpperCase() + role.slice(1)
})
const userInitials = computed(() => {
  if (user.name) {
    const names = user.name.split(' ')
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
    }
    return user.name.charAt(0).toUpperCase()
  }
  return 'U'
})
const getAvatarColor = computed(() => {
  const colors = ['primary', 'success', 'warning', 'info', 'danger']
  const id = user.id || 1
  return colors[id % colors.length]
})

// Sidebar links based on role
const links = [
  // Employee / User
  { name: 'EmployeeDashboard', label: 'Dashboard', role: 'user', icon: 'bi bi-speedometer2', path: '/employee/dashboard' },
  { name: 'TicketList', label: 'My Tickets', role: 'user', icon: 'bi bi-ticket', path: '/employee/tickets' },
  { name: 'CreateTicket', label: 'Create Ticket', role: 'user', icon: 'bi bi-plus-circle', path: '/employee/create-ticket' },

  // Admin
  { name: 'AdminDashboard', label: 'Dashboard', role: 'admin', icon: 'bi bi-speedometer2', path: '/admin/dashboard' },
  // Add other admin links as needed

  // Support Agent
  { name: 'SupportDashboard', label: 'Dashboard', role: 'support', icon: 'bi bi-speedometer2', path: '/support/dashboard' },
  { name: 'AssignedTickets', label: 'Assigned Tickets', role: 'support', icon: 'bi bi-ticket-perforated', path: '/support/tickets' },
  { name: 'AllTickets', label: 'All Tickets', role: 'support', icon: 'bi bi-ticket-detailed', path: '/support/all-tickets' }
]

const filteredLinks = computed(() => {
  return links.filter(link => link.role === user.role)
})

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  if (window.innerWidth < 992) {
    sidebarOpen.value = false
  }
})
</script>

<style scoped>
.app-wrapper {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: #1a1a1a;
  color: white;
  padding: 20px;
  transition: transform 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.nav-link {
  color: #9ca3af;
  padding: 12px 15px;
  border-radius: 8px;
  text-decoration: none;
  margin-bottom: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.nav-link i {
  font-size: 1.2rem;
  width: 24px;
}

.nav-link.router-link-active {
  background: #EB5E28;
  color: white !important;
}

.nav-link:hover:not(.router-link-active) {
  background: #2d2d2d;
  color: white;
}

/* Sidebar footer */
.sidebar-footer {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 15px;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
}

.bg-primary { background: #0d6efd; }
.bg-success { background: #198754; }
.bg-warning { background: #ffc107; color: #000; }
.bg-info { background: #0dcaf0; color: #000; }
.bg-danger { background: #dc3545; }

.text-white-50 {
  color: rgba(255,255,255,0.5);
}

/* Content */
.content-area {
  flex: 1;
  background: #f8f9fa;
  min-width: 0; /* Prevent flex overflow */
}

/* Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Desktop styles */
@media (min-width: 992px) {
  .sidebar {
    transform: translateX(0) !important;
  }
}

/* Mobile styles */
@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    height: 100%;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    box-shadow: 2px 0 8px rgba(0,0,0,0.15);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .content-area {
    width: 100%;
  }
}

/* Small mobile */
@media (max-width: 576px) {
  .sidebar {
    width: 85%;
    max-width: 300px;
  }
}

/* Optional blur effect when sidebar opens on mobile */
.sidebar.open ~ .content-area {
  filter: blur(2px);
  transition: filter 0.3s ease;
}

@media (min-width: 992px) {
  .sidebar.open ~ .content-area {
    filter: none;
  }
}
</style>