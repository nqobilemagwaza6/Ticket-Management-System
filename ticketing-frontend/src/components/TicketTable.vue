<template>
  <div class="card shadow-sm p-3">
    <h5 class="mb-3">Recent Tickets</h5>
    <table class="table table-hover">
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
          <td>{{ index + 1 }}</td>
          <td>
            <router-link :to="`/tickets/${ticket.id}`">{{ ticket.title }}</router-link>
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
            <router-link :to="`/tickets/${ticket.id}`" class="btn btn-sm btn-outline-primary">
              View
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  tickets: { type: Array, default: () => [] }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.badge {
  font-size: 0.85rem;
  padding: 0.4em 0.6em;
}
.table th, .table td {
  vertical-align: middle;
}
.card {
  border-radius: 0.8rem;
}
</style>
