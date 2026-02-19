<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Support Dashboard</h2>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
     
           <!-- Stats Cards Row -->
      <div class="row g-3 mb-4">
        <TicketStatsCard label="ASSIGNED TICKETS" :value="stats.assigned" />
        <TicketStatsCard label="OPEN" :value="stats.open" />
        <TicketStatsCard label="IN PROGRESS" :value="stats.inProgress" />
        <TicketStatsCard label="RESOLVED" :value="stats.resolved" />
      </div>

      <!-- Assigned Tickets Table -->
      <TicketTable :tickets="assignedTickets" />


    </template>
    <!-- Ticket Modal -->
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
            <h5 class="modal-title">{{ selectedTicket.status || 'In Progress' }}</h5>
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
import TicketStatsCard from '@/components/TicketStatsCard.vue'   // adjust path if needed
import TicketTable from '@/components/TicketTable.vue'

const loading = ref(true)
const tickets = ref([])
const userName = ref('Agent')

// Dummy data – replace with API call
tickets.value = [
  {
    id: 1,
    title: 'App logs out every time I try to use it',
    category: 'Software',
    status: 'In Progress',
    assigned_to: 'Agent Smith',
    created_at: '2026-02-16T10:18:00'
  },
  {
    id: 2,
    title: 'Monitor flickering when powered on',
    category: 'Hardware',
    status: 'Open',
    assigned_to: 'Agent Smith',
    created_at: '2026-02-16T09:30:00'
  },
  {
    id: 3,
    title: 'Cannot connect to VPN',
    category: 'Network',
    status: 'Resolved',
    assigned_to: 'Agent Smith',
    created_at: '2026-02-15T14:20:00'
  }
]

// In a real app, you would fetch only tickets assigned to this agent
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

// Simulate loading
onMounted(() => {
  setTimeout(() => { loading.value = false }, 300)
  // Fetch user name from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  userName.value = user.name || 'Agent'
})
</script>


<style scoped>
.modal-body { max-height: 60vh; overflow-y: auto; }
</style>
