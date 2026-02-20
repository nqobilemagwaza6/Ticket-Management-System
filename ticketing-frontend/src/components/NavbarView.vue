<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">TMS</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- User Dashboard -->
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'EmployeeDashboard' }" > Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tickets">Tickets</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const API_BASE = 'https://ticketing-backend-1-mylx.onrender.com'

const logout = async () => {
  try {
    await fetch(`${API_BASE}/api/logout/`, {
      method: 'POST',
      credentials: 'include'
    })
  } catch (err) {
    console.error('Logout error', err)
  }
  localStorage.removeItem('user')
  localStorage.removeItem('isAuthenticated')
  router.push('/login')
}
</script>

<style scoped>
.navbar-brand {
  font-weight: 700;
  font-size: 1.4rem;
}
</style>
