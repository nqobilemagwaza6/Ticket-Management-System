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

      <!-- Header + Filters + Search -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Recent Tickets</h5>

        <div class="d-flex align-items-center gap-2">

          <!-- Filters -->
          <div class="btn-group btn-group-sm">
            <button
              class="btn"
              :class="currentFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setFilter('all')"
            >
              All
            </button>
            <button
              class="btn"
              :class="currentFilter === 'open' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setFilter('open')"
            >
              Open
            </button>
            <button
              class="btn"
              :class="currentFilter === 'closed' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setFilter('closed')"
            >
              Closed
            </button>
          </div>

          <!-- Search -->
          <input
            type="text"
            class="form-control form-control-sm"
            style="width: 200px"
            placeholder="Search tickets..."
            v-model="searchQuery"
            @keyup="debouncedFetch"
          />

          <!-- Create -->
          <router-link
            :to="{ name: 'CreateTicket' }"
            class="btn btn-sm btn-primary"
          >
            + Create Ticket
          </router-link>

        </div>
      </div>

      <!-- Table -->
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

          <tr v-if="recentTickets.length === 0">
            <td colspan="6" class="text-center text-muted py-4">
              No tickets found
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

const searchQuery = ref('')
const currentFilter = ref('all')

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

function setFilter(filter) {
  currentFilter.value = filter
  fetchTickets()
}

/* ---------------------------
   Backend remains unchanged
---------------------------- */
async function fetchTickets() {
  const token = localStorage.getItem('token')

  const params = new URLSearchParams()

  if (currentFilter.value !== 'all') {
    params.append('status', currentFilter.value)
  }

  if (searchQuery.value.trim()) {
    params.append('search', searchQuery.value.trim())
  }

  const url = `http://127.0.0.1:8000/api/tickets/?${params.toString()}`

  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Token ${token}`
      }
    })

    if (!res.ok) throw new Error('Failed to fetch tickets')

    const data = await res.json()

    stats.value.total = data.length
    stats.value.open = data.filter(t => t.status === 'Open').length
    stats.value.inProgress = data.filter(t => t.status === 'In Progress').length
    stats.value.resolved = data.filter(t => t.status === 'Resolved').length

    recentTickets.value = data.slice(0, 5)

  } catch (err) {
    console.error(err)
  }
}

/* Debounce search */
let timer = null
function debouncedFetch() {
  clearTimeout(timer)
  timer = setTimeout(fetchTickets, 300)
}

onMounted(fetchTickets)
</script>