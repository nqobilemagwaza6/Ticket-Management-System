<template>
  <div class="admin-wrapper">

    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header d-flex justify-content-between align-items-center">
        <h5 class="text-white fw-bold mb-0">Admin TMS</h5>
        <button @click="toggleSidebar" class="btn btn-sm btn-dark d-lg-none">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <nav class="nav flex-column mt-4">
        <router-link
          v-for="link in adminLinks"
          :key="link.name"
          :to="link.path"
          class="nav-link"
          @click="closeSidebarOnMobile"
        >
          <i :class="link.icon + ' me-2'"></i>
          {{ link.label }}
        </router-link>
      </nav>
    </aside>

    <!-- Content Area -->
    <div class="content-area">
      <AppHeader @toggleSidebar="toggleSidebar" />

      <main class="p-4">
        <router-view />
      </main>
    </div>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" class="sidebar-overlay d-lg-none" @click="toggleSidebar"></div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const sidebarOpen = ref(false) // Start closed on mobile

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebarOnMobile() {
  if (window.innerWidth < 992) {
    sidebarOpen.value = false
  }
}

const adminLinks = [
  { name: 'AdminDashboard', label: 'Dashboard', icon: 'bi bi-speedometer2', path: '/admin/dashboard' },
  { name: 'AdminUsers', label: 'Users', icon: 'bi bi-people', path: '/admin/users' },
  { name: 'AdminAgents', label: 'Agents', icon: 'bi bi-person-badge', path: '/admin/agents' },
  { name: 'AdminTickets', label: 'Tickets', icon: 'bi bi-ticket-detailed', path: '/admin/tickets' }
]
</script>

<style scoped>
.admin-wrapper {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.admin-sidebar {
  width: 240px;
  background: #111;
  color: white;
  padding: 20px;
  transition: transform 0.3s ease;
  z-index: 1001;
}

.sidebar-header {
  margin-bottom: 20px;
}

.nav-link {
  color: #ccc;
  padding: 10px 12px;
  border-radius: 6px;
  text-decoration: none;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.nav-link.router-link-active {
  background: #EB5E28;
  color: white !important;
}

.nav-link:hover {
  background: #222;
  color: white;
}

.content-area {
  flex: 1;
  background: #f4f5f7;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* Desktop */
@media (min-width: 992px) {
  .admin-sidebar {
    transform: translateX(0) !important;
  }
}

/* Mobile */
@media (max-width: 991px) {
  .admin-sidebar {
    position: fixed;
    height: 100%;
    transform: translateX(-100%);
  }

  .admin-sidebar.open {
    transform: translateX(0);
  }
}
</style>