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
import { ref, onMounted } from 'vue'

const loading = ref(true)
const tickets = ref([])
const selectedTicket = ref(null)

// Fetch all tickets from API (replace with actual endpoint)
const fetchTickets = async () => {
  try {
    // Replace with your actual API endpoint for all tickets
    // const response = await fetch('/api/support/tickets/all/')
    // tickets.value = await response.json()
    
    // Dummy data for now
    tickets.value = [
      {
        id: 1,
        number: 'TT1125845',
        submittedBy: 'John Doe',
        createdAt: '2026-02-16T10:18:00',
        category: 'Software',
        assignedTo: 'Agent Smith',
        lastUpdated: '2026-02-16T11:01:00',
        description: 'App logs out every time I try to use it',
        status: 'In Progress'
      },
      {
        id: 2,
        number: 'TT1125846',
        submittedBy: 'Jane Roe',
        createdAt: '2026-02-16T09:30:00',
        category: 'Hardware',
        assignedTo: 'Agent Smith',
        lastUpdated: '2026-02-16T10:45:00',
        description: 'Monitor flickering when powered on',
        status: 'Open'
      },
      {
        id: 3,
        number: 'TT1125847',
        submittedBy: 'Alice Lee',
        createdAt: '2026-02-15T14:20:00',
        category: 'Network',
        assignedTo: 'Agent Smith',
        lastUpdated: '2026-02-16T08:15:00',
        description: 'Cannot connect to VPN',
        status: 'Resolved'
      },
      {
        id: 4,
        number: 'TT1125848',
        submittedBy: 'Bob Johnson',
        createdAt: '2026-02-15T09:10:00',
        category: 'Software',
        assignedTo: 'Agent Jones',
        lastUpdated: '2026-02-16T09:30:00',
        description: 'Application crashes on startup',
        status: 'Open'
      }
    ]
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
function markResolved() {
  alert('Ticket marked resolved (API call would go here)')
  // In a real app, you'd call an API to update the ticket status,
  // then refresh the list or update locally.
  closeModal()
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