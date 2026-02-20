<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">All Tickets</h2>
      <span class="badge bg-secondary">{{ tickets.length }} total</span>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Tickets list -->
    <div v-else>
      <div v-if="tickets.length === 0" class="alert alert-info text-center">
        No tickets found.
      </div>
      <ul v-else class="list-group">
        <li
          v-for="ticket in tickets"
          :key="ticket.id"
          class="list-group-item list-group-item-action d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center"
          @click="selectTicket(ticket)"
          style="cursor: pointer"
        >
          <div class="mb-2 mb-sm-0">
            <strong>#{{ ticket.number }}</strong> – {{ ticket.submittedBy }}
            <span class="d-block d-sm-inline text-muted small ms-sm-2">
              {{ ticket.category }}
            </span>
          </div>
          <div class="d-flex align-items-center">
            <span class="badge me-2" :class="statusBadgeClass(ticket.status)">
              {{ ticket.status }}
            </span>
            <span class="badge" :class="ticketCategoryClass(ticket.category)">
              {{ ticket.category }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Ticket Detail Modal (same as AssignedTicketsView) -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block;"
      v-if="selectedTicket"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedTicket.status }}</h5>
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
            <button class="btn btn-success" @click="markResolved(selectedTicket)">Mark as Resolved</button>
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
import { ref, onMounted } from 'vue'

const loading = ref(true)
const tickets = ref([])
const selectedTicket = ref(null)
const API_BASE = 'https://ticketing-backend-1-mylx.onrender.com'


// Fetch all tickets from API (replace with actual endpoint)
const fetchTickets = async () => {
  try {
    loading.value = true

    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE}/api/tickets/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch tickets')
    }

    const data = await response.json()

    // Map backend fields to your frontend structure
    tickets.value = data.map(t => ({
      id: t.id,
      number: t.ticket_number || `TT${t.id}`,  // adjust if needed
      submittedBy: t.user,                     // comes from serializer
      createdAt: t.created_at,
      category: t.category,
      assignedTo: t.agent || 'Unassigned',     // serializer agent field
      lastUpdated: t.updated_at,
      description: t.description,
      status: t.status
    }))

  } catch (error) {
    console.error('Failed to fetch tickets:', error)
  } finally {
    loading.value = false
  }
}


onMounted(fetchTickets)

// Modal handlers
function selectTicket(ticket) {
  selectedTicket.value = { ...ticket }
}
function closeModal() {
  selectedTicket.value = null
}

// Helper functions
function ticketCategoryClass(category) {
  switch (category.toLowerCase()) {
    case 'software': return 'bg-primary text-white'
    case 'hardware': return 'bg-warning text-dark'
    case 'network': return 'bg-info text-white'
    default: return 'bg-secondary text-white'
  }
}
function statusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case 'open': return 'bg-success'
    case 'in progress': return 'bg-warning text-dark'
    case 'resolved': return 'bg-secondary'
    default: return 'bg-light text-dark'
  }
}
function formatDateTime(d) {
  return new Date(d).toLocaleString()
}
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


function addComment() {
  const comment = prompt('Add your comment:')
  if (comment) {
    console.log('Comment added:', comment)
   
  }
}
</script>

<style scoped>
.modal-body { max-height: 60vh; overflow-y: auto; }
</style>