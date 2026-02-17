<template>
  <div class="layout-wrapper">
    
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h4>IT Support Portal</h4>
      </div>

      <nav class="nav flex-column mt-4">
        <router-link 
          :to="{ name: 'EmployeeDashboard' }"
          class="nav-link"
        >
          Dashboard
        </router-link>

        <router-link 
          :to="{ name: 'TicketList' }"
          class="nav-link"
        >
          My Tickets
        </router-link>

        <router-link 
          :to="{ name: 'CreateTicket' }"
          class="nav-link"
        >
          Create Ticket
        </router-link>
      </nav>

      <div class="sidebar-footer mt-auto">
        <button class="btn btn-sm btn-outline-light w-100" @click="logout">
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('isAuthenticated')
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100vh;
  font-family: 'Inter', Roboto, Helvetica, Arial, sans-serif;
}

/* Sidebar styling */
.sidebar {
  width: 240px;
  background-color: #000; /* black background */
  color: var(--white);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.sidebar-header {
  font-weight: bold;
  font-size: 18px;
  color: var(--white);
}

.nav-link {
  color: #9ca3af; /* muted text for inactive links */
  margin-bottom: 10px;
  border-radius: 6px;
  padding: 8px 12px;
  transition: background 0.2s ease, color 0.2s ease;
  text-decoration: none;
}

.nav-link.router-link-active {
  background: var(--accent-orange); /* highlight active link */
  color: var(--white) !important;
}

.nav-link:hover {
  background: #1f1f1f; /* slightly lighter black on hover */
  color: var(--white);
}

/* Footer logout button */
.sidebar-footer {
  margin-top: auto;
}

/* Main content area */
.main-content {
  flex: 1;
  background: #f8f9fa;
  padding: 30px;
  overflow-y: auto;
}
</style>
