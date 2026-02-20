<template>
  <div class="card shadow-sm p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Recent Tickets</h5>
      <span v-if="tickets.length" class="badge bg-secondary">{{ tickets.length }} total</span>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Assigned Agent</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ticket, index) in tickets" :key="ticket.id">
            <td data-label="#">{{ index + 1 }}</td>
            <td data-label="Title">
              <router-link :to="`/tickets/${ticket.id}`" class="ticket-link">
                {{ ticket.title }}
              </router-link>
            </td>
            <td data-label="Category">{{ ticket.category || '—' }}</td>
            <td data-label="Status">
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
            <td>{{ ticket.agent || 'Unassigned' }}</td>
            <td>{{ formatDate(ticket.created_at) }}</td>
            <td>
                <button
              class="btn btn-sm btn-outline-brand"
              @click.stop="selectTicket(ticket)"
            >
              View
            </button>
            </td>
          </tr>
          <tr v-if="!tickets.length">
            <td colspan="7" class="text-center py-4 text-muted">
              No tickets to display
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  tickets: { type: Array, default: () => [] }
})

const emit = defineEmits(['view-ticket'])

function selectTicket(ticket) {
  emit('view-ticket', ticket)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>



<style scoped>
.card {
  border-radius: 0.8rem;
  border: none;
}

.table th {
  font-weight: 600;
  color: #4b5563;
  border-bottom-width: 1px;
}

.table td {
  vertical-align: middle;
  color: #1f2937;
}

.ticket-link {
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.ticket-link:hover {
  color: #EB5E28;
  text-decoration: underline;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* Brand outline button */
.btn-outline-brand {
  color: #EB5E28;
  border: 1px solid #EB5E28;
  background: transparent;
  transition: all 0.2s ease-in-out;
}

.btn-outline-brand:hover {
  background: #EB5E28;
  color: white;
  border-color: #EB5E28;
}

/* Responsive table */
.table-responsive {
  border-radius: 0.5rem;
}

/* Small-screen stacked rows */
@media (max-width: 576px) {
  .table thead { display: none; }
  .table, .table tbody, .table tr, .table td { display: block; width: 100%; }
  .table tr { margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.04); padding: 8px; border-radius: 8px; }
  .table td { display: flex; justify-content: space-between; padding: 8px 12px; border: none; }
  .table td::before { content: attr(data-label); font-weight: 600; color: #6b7280; margin-right: 12px; }
  .ticket-link { display: inline-block; max-width: 60%; }
  .btn-outline-brand { padding: 6px 8px; font-size: 0.85rem; }
}
</style>