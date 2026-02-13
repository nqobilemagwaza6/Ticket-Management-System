<template>
  <div class="dashboard-root">
    <!-- Navbar -->
    <NavbarView />

    <div class="container-fluid mt-4">

      <!-- Welcome Header -->
      <div class="mb-4">
        <h2 class="fw-bold">Welcome, {{ userName }}</h2>
      </div>

      <!-- Quick Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3" v-for="stat in statsArray" :key="stat.label">
          <div class="card shadow-sm p-3 text-center">
            <h6 class="text-uppercase">{{ stat.label }}</h6>
            <h3 class="fw-bold">{{ stat.value }}</h3>
          </div>
        </div>
      </div>

      <!-- Recent Tickets Table -->
      <div class="card shadow-sm p-3">
        <h5 class="mb-3">Recent Tickets</h5>
        <table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ticket, index) in recentTickets" :key="ticket.id">
              <td>{{ index + 1 }}</td>
              <td>{{ ticket.title }}</td>
              <td>{{ ticket.priority }}</td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-warning text-dark': ticket.status === 'Open',
                    'bg-primary': ticket.status === 'In Progress',
                    'bg-success': ticket.status === 'Resolved'
                  }"
                >
                  {{ ticket.status }}
                </span>
              </td>
              <td>{{ formatDate(ticket.created_at) }}</td>
              <td>
                <router-link
                  :to="`/tickets/${ticket.id}`"
                  class="btn btn-sm btn-outline-primary"
                >
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NavbarView from '@/components/NavbarView.vue'

// Get logged-in user from localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = ref(user.full_name || 'User')

// Ticket stats
const stats = ref({ open: 0, inProgress: 0, resolved: 0 })
const recentTickets = ref([])

// Map stats for quick display cards
const statsArray = computed(() => [
  { label: 'Open', value: stats.value.open },
  { label: 'In Progress', value: stats.value.inProgress },
  { label: 'Resolved', value: stats.value.resolved }
])

// Format date nicely
function formatDate(dateStr) {
  if (!dateStr) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

// Fetch tickets from REST API
async function fetchTickets() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/tickets/', {
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Failed to fetch tickets')
    const data = await res.json()

    // Filter only logged-in user's tickets
    const userTickets = data.filter(t => t.user_id === user.id)

    // Limit to 5 most recent tickets
    recentTickets.value = userTickets.slice(0, 5)

    // Calculate stats
    stats.value.open = userTickets.filter(t => t.status === 'Open').length
    stats.value.inProgress = userTickets.filter(t => t.status === 'In Progress').length
    stats.value.resolved = userTickets.filter(t => t.status === 'Resolved').length

  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchTickets()
})
</script>

<style scoped>
.dashboard-root {
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.card {
  border-radius: 0.8rem;
}

.table th, .table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.9rem;
  padding: 0.4em 0.6em;
}
</style>
