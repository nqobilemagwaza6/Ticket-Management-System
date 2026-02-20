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
                <strong>Ticket #:</strong> {{ selectedTicket.id }}
              </li>
              <li class="list-group-item">
                <strong>Submitted by:</strong> {{ selectedTicket.user }}
              </li>
              <li class="list-group-item">
                <strong>Created:</strong> {{ formatDateTime(selectedTicket.created_at) }}
              </li>
              <li class="list-group-item">
                <strong>Category:</strong>
                <span class="badge" :class="ticketCategoryClass(selectedTicket.category)">
                  {{ selectedTicket.category }}
                </span>
              </li>
              <li class="list-group-item">
                <strong>Assigned to:</strong> {{ selectedTicket.agent || selectedTicket.assigned_to }}
              </li>
              <li class="list-group-item">
                <strong>Last Updated:</strong> {{ formatDateTime(selectedTicket.updated_at) }}
              </li>
              <li class="list-group-item">
                <strong>Description:</strong>
                <p class="mb-0">{{ selectedTicket.description }}</p>
              </li>
            </ul>
          </div>

          <div class="modal-footer">
            <button class="btn btn-success" @click="markResolved(selectedTicket)">Mark as Resolved</button>
            <button class="btn btn-primary" @click="addComment(selectedTicket)">Add Comment</button>
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
const selectedTicket = ref(null)
const API_BASE = 'https://ticket-management-system-aw70.onrender.com'


/* ---------------- HELPERS ---------------- */
function ticketCategoryClass(category) {
  switch ((category || '').toLowerCase()) {
    case 'software': return 'bg-primary text-white'
    case 'hardware': return 'bg-warning text-dark'
    case 'network': return 'bg-info text-white'
    default: return 'bg-secondary text-white'
  }
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString()
}

/* ---------------- MODAL HANDLERS ---------------- */
function openTicket(ticket) {
  selectedTicket.value = { ...ticket }
}

function closeModal() {
  selectedTicket.value = null
}

function addComment(ticket) {
  const comment = prompt('Add your comment:')
  if (comment) console.log('Comment added for ticket', ticket.id, comment)
}

/* ---------------- FETCH ASSIGNED TICKETS ---------------- */
async function fetchAssignedTickets() {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('${API_BASE}/api/assigned_tickets/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
    if (!res.ok) throw new Error('Failed to fetch tickets')
    const data = await res.json()
    tickets.value = data
  } catch (err) {
    console.error(err)
    tickets.value = []
  } finally {
    loading.value = false
  }
}

/* ---------------- MARK RESOLVED ---------------- */
async function markResolved(ticket) {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_BASE}/api/tickets/${ticket.id}/assign/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ status: 'Resolved' })
    })

    if (!res.ok) throw new Error('Failed to update ticket')
    const updated = await res.json()

    // Update the ticket locally so UI updates immediately
    const index = tickets.value.findIndex(t => t.id === ticket.id)
    if (index !== -1) tickets.value[index] = updated

    // Also update the modal if it’s open
    if (selectedTicket.value?.id === ticket.id) {
      selectedTicket.value = updated
    }

  } catch (err) {
    console.error(err)
    alert('Failed to mark ticket as resolved')
  }
}

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
onMounted(fetchAssignedTickets)
</script>

<style scoped>
.modal-body { max-height: 60vh; overflow-y: auto; }
</style>
