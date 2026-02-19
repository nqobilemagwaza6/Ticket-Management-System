<template>
  <div>

    <!-- Welcome -->
    <div class="mb-4">
      <h2 class="fw-bold">Welcome, {{ userName }}</h2>
      <p class="text-muted">Here's a summary of your IT support tickets.</p>
    </div>

    <!-- Summary Cards -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3" v-for="stat in statsArray" :key="stat.label">
        <div class="card shadow-sm p-3 text-center">
          <h6 class="text-uppercase">{{ stat.label }}</h6>
          <h3 class="fw-bold">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Recent Tickets -->
    <div class="card shadow-sm p-3 mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Recent Tickets</h5>
        <router-link 
          :to="{ name: 'CreateTicket' }" 
          class="btn btn-sm btn-primary"
        >
          + Create Ticket
        </router-link>
      </div>

      <table class="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Assigned Agent</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in recentTickets" :key="ticket.id">
            <td>
              <router-link
                :to="{ name: 'TicketDetail', params: { id: ticket.id } }"
              >
                {{ ticket.title }}
              </router-link>
            </td>
            <td>{{ ticket.category }}</td>
            <td>
              <span class="badge"
                :class="{
                  'bg-warning text-dark': ticket.status === 'Open',
                  'bg-primary': ticket.status === 'In Progress',
                  'bg-success': ticket.status === 'Resolved'
                }"
              >
                {{ ticket.status }}
              </span>
            </td>
            <td>{{ ticket.assigned_to || 'Unassigned' }}</td>
            <td>{{ formatDate(ticket.created_at) }}</td>
            <td>
              <router-link
                :to="{ name: 'TicketDetail', params: { id: ticket.id } }"
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = ref(user.full_name || 'User')

const stats = ref({
  total: 0,
  open: 0,
  inProgress: 0,
  resolved: 0
})

const recentTickets = ref([])

const statsArray = computed(() => [
  { label: 'Total Tickets', value: stats.value.total },
  { label: 'Open', value: stats.value.open },
  { label: 'In Progress', value: stats.value.inProgress },
  { label: 'Resolved', value: stats.value.resolved }
])

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

async function fetchTickets() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/tickets/', {
      credentials: 'include'
    })

    if (!res.ok) throw new Error('Failed to fetch tickets')

    const data = await res.json()
    const userTickets = data.filter(t => t.user_id === user.id)

    stats.value.total = userTickets.length
    stats.value.open = userTickets.filter(t => t.status === 'Open').length
    stats.value.inProgress = userTickets.filter(t => t.status === 'In Progress').length
    stats.value.resolved = userTickets.filter(t => t.status === 'Resolved').length

    recentTickets.value = userTickets.slice(0, 5)

  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchTickets)
</script>
