<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Assigned Tickets</h2>
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
        No tickets assigned to you.
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
            <strong>#{{ ticket.id }}</strong> – {{ ticket.title }}
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

    <!-- Ticket Detail Modal -->
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
              <li class="list-group-item"><strong>Ticket #:</strong> {{ selectedTicket.id }}</li>
              <li class="list-group-item"><strong>Submitted by:</strong> {{ selectedTicket.user }}</li>
              <li class="list-group-item"><strong>Created:</strong> {{ formatDateTime(selectedTicket.created_at) }}</li>
              <li class="list-group-item">
                <strong>Category:</strong>
                <span class="badge" :class="ticketCategoryClass(selectedTicket.category)">
                  {{ selectedTicket.category }}
                </span>
              </li>
              <li class="list-group-item"><strong>Assigned to:</strong> {{ selectedTicket.agent || selectedTicket.assigned_to }}</li>
              <li class="list-group-item"><strong>Last Updated:</strong> {{ formatDateTime(selectedTicket.updated_at) }}</li>
              <li class="list-group-item">
                <strong>Description:</strong>
                <p class="mb-0">{{ selectedTicket.description }}</p>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
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


/* ---------------- HELPERS ---------------- */
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
function selectTicket(ticket) {
  selectedTicket.value = { ...ticket }
}
function closeModal() {
  selectedTicket.value = null
}

/* ---------------- FETCH TICKETS ---------------- */
const fetchTickets = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')  // make sure your auth token is stored here
    const res = await fetch(`${API_BASE}/api/assigned_tickets/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
    if (!res.ok) throw new Error('Failed to fetch tickets')
    const data = await res.json()
    tickets.value = data
    console.log('Assigned tickets:', data)
  } catch (err) {
    console.error(err)
    tickets.value = []
  } finally {
    loading.value = false
  }
}

/* ---------------- LIFECYCLE ---------------- */
onMounted(fetchTickets)
</script>

<style scoped>
.modal-body { max-height: 60vh; overflow-y: auto; }
</style>
