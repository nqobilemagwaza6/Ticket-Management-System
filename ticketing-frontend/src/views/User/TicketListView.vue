<template>
  <div>
    <div class="ticket-list-container">
      <!-- Header with tabs -->
      <div class="ticket-header mb-4">
        <h2 class="fw-bold">Ticket History</h2>
        
        <!-- Status Tabs -->
        <div class="status-tabs d-flex gap-3 mt-3">
          <button 
            class="status-tab" 
            :class="{ active: currentFilter === 'open' }"
            @click="currentFilter = 'open'"
          >
            Open ({{ stats.open }})
          </button>
          <button 
            class="status-tab" 
            :class="{ active: currentFilter === 'closed' }"
            @click="currentFilter = 'closed'"
          >
            Closed ({{ stats.resolved }})
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="search-section mb-4">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search"></i>
          </span>
          <input 
            type="text" 
            class="form-control border-start-0 ps-0" 
            placeholder="Search tickets..."
            v-model="searchQuery"
          >
        </div>
      </div>

      <!-- Tickets Table -->
      <div class="card">
        <div class="card-body p-0">
          <table class="table ticket-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Create Date</th>
                <th>Status</th>
                <th>Subject</th>
               
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in filteredTickets" :key="ticket.id">
                <td>
                  <span class="ticket-number">#{{ ticket.id }}</span>
                </td>
                <td>{{ formatDate(ticket.created_at) }}</td>
                <td>
                  <span class="badge" :class="getStatusClass(ticket.status)">
                    {{ ticket.status }}
                  </span>
                </td>
                <td>
                  <router-link :to="`/tickets/${ticket.id}`" class="ticket-subject">
                    {{ ticket.title }}
                  </router-link>
                </td>
                <td>{{ ticket.category || 'Maintenance' }}</td>
                <td>
                  <router-link :to="`/tickets/${ticket.id}`" class="btn btn-link btn-sm">
                    View →
                  </router-link>
                </td>
              </tr>
              <tr v-if="filteredTickets.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  No tickets found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="card-footer bg-white d-flex justify-content-between align-items-center">
          <div class="text-muted small">
            Showing {{ paginationStart }} - {{ paginationEnd }} of {{ filteredTickets.length }} tickets
          </div>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="currentPage--">‹</a>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="currentPage++">›</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const currentFilter = ref('open')
const currentPage = ref(1)
const itemsPerPage = 5

const stats = ref({
  total: 0,
  open: 0,
  resolved: 0
})

const tickets = ref([])

const filteredTickets = computed(() => {
  let filtered = tickets.value
  
  // Filter by status
  if (currentFilter.value === 'open') {
    filtered = filtered.filter(t => t.status !== 'Resolved')
  } else if (currentFilter.value === 'closed') {
    filtered = filtered.filter(t => t.status === 'Resolved')
  }
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.id.toString().includes(query)
    )
  }
  
  return filtered
})

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTickets.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredTickets.value.length / itemsPerPage)
)

const paginationStart = computed(() => 
  ((currentPage.value - 1) * itemsPerPage) + 1
)

const paginationEnd = computed(() => 
  Math.min(currentPage.value * itemsPerPage, filteredTickets.value.length)
)

function getStatusClass(status) {
  switch(status) {
    case 'Open':
      return 'badge-open'
    case 'In Progress':
      return 'badge-progress'
    case 'Resolved':
      return 'badge-resolved'
    default:
      return 'badge-open'
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`
}

async function fetchTickets() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/tickets/', {
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Failed to fetch tickets')
    const data = await res.json()
    
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userTickets = data.filter(t => t.user_id === user.id)
    
    tickets.value = userTickets
    
    stats.value.total = userTickets.length
    stats.value.open = userTickets.filter(t => t.status !== 'Resolved').length
    stats.value.resolved = userTickets.filter(t => t.status === 'Resolved').length
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchTickets)
</script>

<style scoped>
.ticket-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.status-tabs {
  border-bottom: 1px solid #e5e7eb;
}

.status-tab {
  background: none;
  border: none;
  padding: 8px 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.status-tab.active {
  color: #EB5E28;
}

.status-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #EB5E28;
}

.search-section .input-group-text {
  border: 1px solid #e5e7eb;
  border-right: none;
  background: white;
  color: #9ca3af;
}

.search-section .form-control {
  border: 1px solid #e5e7eb;
  border-left: none;
  box-shadow: none;
}

.search-section .form-control:focus {
  border-color: #e5e7eb;
}

.ticket-table {
  margin: 0;
}

.ticket-table th {
  background: #f9fafb;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.ticket-table td {
  padding: 16px;
  vertical-align: middle;
  border-bottom: 1px solid #f3f4f6;
}

.ticket-number {
  font-weight: 600;
  color: #374151;
}

.ticket-subject {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  max-width: 300px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticket-subject:hover {
  color: #EB5E28;
}

.badge-open {
  background-color: #FEF3C7;
  color: #92400E;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge-progress {
  background-color: #E0F2FE;
  color: #0369A1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge-resolved {
  background-color: #DCFCE7;
  color: #166534;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.pagination {
  gap: 2px;
}

.page-link {
  border: none;
  color: #6b7280;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
}

.page-item.active .page-link {
  background-color: #EB5E28;
  color: white;
}

.page-link:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.card-footer {
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px;
}
</style>