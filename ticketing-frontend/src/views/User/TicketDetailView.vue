<template>
  <div class="container mt-4">
    <UserNavbar />
    <h2>{{ ticket.title }}</h2>
    <p><strong>Category:</strong> {{ ticket.category }}</p>
    <p><strong>Status:</strong> {{ ticket.status }}</p>
    <p v-if="ticket.priority"><strong>Priority:</strong> {{ ticket.priority }}</p>
    <p><strong>Assigned Agent:</strong> {{ ticket.assigned_to || 'Unassigned' }}</p>
    <p><strong>Created At:</strong> {{ formatDate(ticket.created_at) }}</p>
    <p><strong>Last Updated:</strong> {{ formatDate(ticket.updated_at) }}</p>

    <div class="mt-4">
      <h5>Activity Timeline</h5>
      <TicketTimeline :activities="ticket.activities" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import UserNavbar from './components/UserNavbar.vue'
import TicketTimeline from './components/TicketTimeline.vue'

const route = useRoute()
const ticket = ref({ activities: [] })

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

async function fetchTicket() {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/tickets/${route.params.id}/`, {
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Failed to fetch ticket')
    ticket.value = await res.json()
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchTicket)
</script>
