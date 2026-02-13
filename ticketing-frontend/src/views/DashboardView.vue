<template>
  <div class="dashboard-root">
    <Navbar />

    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-center shadow-sm p-3">
            <h5>Total Tickets</h5>
            <p class="display-6">{{ tickets.length }}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center shadow-sm p-3">
            <h5>Open Tickets</h5>
            <p class="display-6">{{ openTickets.length }}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center shadow-sm p-3">
            <h5>Resolved Tickets</h5>
            <p class="display-6">{{ resolvedTickets.length }}</p>
          </div>
        </div>
      </div>

      <div class="card shadow-sm p-3">
        <h5 class="mb-3">Recent Tickets</h5>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ticket, index) in tickets" :key="ticket.id">
              <td>{{ index + 1 }}</td>
              <td>{{ ticket.title }}</td>
              <td>{{ ticket.priority }}</td>
              <td>
                <span
                  :class="{
                    'badge bg-success': ticket.status === 'Resolved',
                    'badge bg-warning': ticket.status === 'In Progress',
                    'badge bg-primary': ticket.status === 'Open'
                  }"
                >
                  {{ ticket.status }}
                </span>
              </td>
              <td>{{ ticket.assigned_to || 'Unassigned' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/NavbarView.vue'
import { ref, computed } from 'vue'

// Placeholder tickets — later fetch from API
const tickets = ref([
  { id: 1, title: 'Printer not working', priority: 'High', status: 'Open', assigned_to: 'Agent A' },
  { id: 2, title: 'Cannot access email', priority: 'Medium', status: 'In Progress', assigned_to: 'Agent B' },
  { id: 3, title: 'Computer slow', priority: 'Low', status: 'Resolved', assigned_to: 'Agent C' }
])

const openTickets = computed(() => tickets.value.filter(t => t.status === 'Open'))
const resolvedTickets = computed(() => tickets.value.filter(t => t.status === 'Resolved'))
</script>

<style scoped>
.dashboard-root {
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.card {
  border-radius: 12px;
}

.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.75em;
}
</style>
