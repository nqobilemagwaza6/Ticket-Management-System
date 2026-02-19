<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Support Dashboard</h2>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <TicketStatsCard label="ASSIGNED TICKETS" :value="stats.assigned" />
        <TicketStatsCard label="OPEN" :value="stats.open" />
        <TicketStatsCard label="IN PROGRESS" :value="stats.inProgress" />
        <TicketStatsCard label="RESOLVED" :value="stats.resolved" />
      </div>

      <!-- Tickets Table -->
      <TicketTable
        :tickets="assignedTickets"
        @view-ticket="openTicket"
      />
    </template>

    <!-- Ticket Modal -->
    <div
      v-if="selectedTicket"
      class="modal fade show"
      tabindex="-1"
      style="display: block;"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedTicket.status || 'Ticket Details' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <strong>Ticket #:</strong> {{ selectedTicket.number }}
              </li>
              <li class="list-group-item">
                <strong>Submitted by:</strong> {{ selectedTicket.submittedBy }}
              </li>
              <li class="list-group-item">
                <strong>Created:</strong> {{ formatDateTime(selectedTicket.createdAt) }}
              </li>
              <li class="list-group-item">
                <strong>Category:</strong>
                <span class="badge" :class="ticketCategoryClass(selectedTicket.category)">
                  {{ selectedTicket.category }}
                </span>
              </li>
              <li class="list-group-item">
                <strong>Assigned to:</strong> {{ selectedTicket.assignedTo }}
              </li>
              <li class="list-group-item">
                <strong>Last Updated:</strong> {{ formatDateTime(selectedTicket.lastUpdated) }}
              </li>
              <li class="list-group-item">
                <strong>Description:</strong>
                <p class="mb-0">{{ selectedTicket.description }}</p>
              </li>
            </ul>
          </div>

          <div class="modal-footer">
            <button class="btn btn-success" @click="markResolved">Mark as Resolved</button>
            <button class="btn btn-primary" @click="addComment">Add Comment</button>
            <button class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedTicket" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TicketTable from '@/components/TicketTable.vue'
import TicketStatsCard from '@/components/TicketStatsCard.vue'

/* ---------------- STATE ---------------- */
const loading = ref(true)
const tickets = ref([])
const userName = ref('Agent')
const selectedTicket = ref(null)

/* ---------------- FUNCTIONS ---------------- */
function openTicket(ticket) {
  selectedTicket.value = {
    number: ticket.id,
    submittedBy: ticket.title,
    category: ticket.category,
    status: ticket.status,
    assignedTo: ticket.assigned_to,
    createdAt: ticket.created_at,
    lastUpdated: ticket.created_at,
    description: ticket.title
  }
}

function closeModal() {
  selectedTicket.value = null
}

function ticketCategoryClass(category) {
  switch ((category || '').toLowerCase()) {
    case 'software': return 'bg-primary text-white'
    case 'hardware': return 'bg-warning text-dark'
    case 'network': return 'bg-info text-white'
    default: return 'bg-secondary text-white'
  }
}

function markResolved() {
  alert('Ticket marked as resolved (API call would go here)')
  closeModal()
}

function addComment() {
  const comment = prompt('Add your comment:')
  if (comment) console.log('Comment added:', comment)
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString()
}

/* ---------------- DUMMY DATA ---------------- */
tickets.value = [
  { id: 1, title: 'App logs out every time I try to use it', category: 'Software', status: 'In Progress', assigned_to: 'Agent Smith', created_at: '2026-02-16T10:18:00' },
  { id: 2, title: 'Monitor flickering when powered on', category: 'Hardware', status: 'Open', assigned_to: 'Agent Smith', created_at: '2026-02-16T09:30:00' },
  { id: 3, title: 'Cannot connect to VPN', category: 'Network', status: 'Resolved', assigned_to: 'Agent Smith', created_at: '2026-02-15T14:20:00' }
]

/* ---------------- COMPUTED ---------------- */
const assignedTickets = computed(() => tickets.value)

const stats = computed(() => {
  const all = assignedTickets.value
  return {
    assigned: all.length,
    open: all.filter(t => t.status === 'Open').length,
    inProgress: all.filter(t => t.status === 'In Progress').length,
    resolved: all.filter(t => t.status === 'Resolved').length
  }
})

/* ---------------- LIFECYCLE ---------------- */
onMounted(() => {
  setTimeout(() => { loading.value = false }, 300)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  userName.value = user.name || 'Agent'
})
</script>

<style scoped>
.modal-body { max-height: 60vh; overflow-y: auto; }
</style>
