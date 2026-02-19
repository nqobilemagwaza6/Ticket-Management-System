<template>
  <div class="admin-tickets">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Ticket Management</h2>
        <p class="text-muted">Manage and monitor all support tickets</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="exportTickets">
          <i class="bi bi-download me-2"></i>Export
        </button>
        <button class="btn btn-primary" @click="showFilters = !showFilters">
          <i class="bi bi-funnel me-2"></i>Filters
        </button>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="filters.status">
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Priority</label>
            <select class="form-select" v-model="filters.priority">
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Agent</label>
            <select class="form-select" v-model="filters.agent">
              <option value="">All</option>
              <option value="unassigned">Unassigned</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.id">
                {{ agent.name }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Date Range</label>
            <select class="form-select" v-model="filters.dateRange">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-secondary" @click="resetFilters">
              Reset
            </button>
            <button class="btn btn-sm btn-primary" @click="applyFilters">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="selectAll" @change="toggleAll">
                  </div>
                </th>
                <th>ID</th>
                <th>Title</th>
                <th>User</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned Agent</th>
                <th>Created</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in filteredTickets" :key="ticket.id">
                <td>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="selectedTickets" :value="ticket.id">
                  </div>
                </td>
                <td><span class="fw-medium">#{{ ticket.id }}</span></td>
                <td>
                  <router-link :to="`/admin/tickets/${ticket.id}`" class="text-decoration-none">
                    {{ ticket.title }}
                  </router-link>
                </td>
                <td>{{ ticket.user }}</td>
                <td>{{ ticket.category }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(ticket.status)">
                    {{ ticket.status }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="getPriorityBadgeClass(ticket.priority)">
                    {{ ticket.priority }}
                  </span>
                </td>
                <td>
                  <span v-if="ticket.agent" class="d-flex align-items-center gap-2">
                    {{ ticket.agent }}
                    <button class="btn btn-sm btn-link text-warning p-0" @click="reassignTicket(ticket)">
                      <i class="bi bi-arrow-repeat"></i>
                    </button>
                  </span>
                  <span v-else class="text-muted fst-italic">
                    Unassigned
                    <button class="btn btn-sm btn-link text-primary p-0 ms-2" @click="assignTicket(ticket)">
                      Assign
                    </button>
                  </span>
                </td>
                <td>{{ formatDate(ticket.created_at) }}</td>
                <td>{{ formatDate(ticket.updated_at) }}</td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="viewTicket(ticket.id)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" @click="editTicket(ticket)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteTicket(ticket.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredTickets.length === 0">
                <td colspan="11" class="text-center py-4 text-muted">
                  No tickets found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="card-footer bg-white d-flex justify-content-between align-items-center">
        <div class="text-muted small">
          Showing {{ pagination.start }} to {{ pagination.end }} of {{ pagination.total }} tickets
        </div>
        <nav>
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: pagination.page === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(pagination.page - 1)">Previous</a>
            </li>
            <li class="page-item" v-for="page in pagination.pages" :key="page" :class="{ active: page === pagination.page }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: pagination.page === pagination.lastPage }">
              <a class="page-link" href="#" @click.prevent="changePage(pagination.page + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedTickets.length > 0" class="bulk-actions-bar card">
      <div class="card-body d-flex justify-content-between align-items-center">
        <span>{{ selectedTickets.length }} tickets selected</span>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" @click="bulkAssign">
            <i class="bi bi-person-plus me-2"></i>Assign to Agent
          </button>
          <button class="btn btn-sm btn-outline-warning" @click="bulkUpdateStatus">
            <i class="bi bi-arrow-repeat me-2"></i>Update Status
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="bulkDelete">
            <i class="bi bi-trash me-2"></i>Delete
          </button>
          <button class="btn btn-sm btn-outline-secondary" @click="selectedTickets = []">
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Assign Ticket Modal -->
    <div class="modal fade" id="assignModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Assign Ticket</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Select Agent</label>
              <select class="form-select" v-model="selectedAgentId">
                <option v-for="agent in agents" :key="agent.id" :value="agent.id">
                  {{ agent.name }} ({{ agent.ticketCount }} active tickets)
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="confirmAssign">Assign</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- View Ticket Modal -->
  <div class="modal fade" id="viewTicketModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ticket Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div v-if="viewTicketModal">
            <h5 class="mb-2">#{{ viewTicketModal.id }} - {{ viewTicketModal.title }}</h5>
            <p><strong>User:</strong> {{ viewTicketModal.user || 'N/A' }}</p>
            <p><strong>Category:</strong> {{ viewTicketModal.category || 'N/A' }}</p>
            <p><strong>Status:</strong> {{ viewTicketModal.status || 'N/A' }}</p>
            <p><strong>Priority:</strong> {{ viewTicketModal.priority || 'N/A' }}</p>
            <p><strong>Assigned Agent:</strong> {{ viewTicketModal.agent || 'Unassigned' }}</p>
            <p class="text-muted">{{ viewTicketModal.description || 'No description.' }}</p>
          </div>
          <div v-else class="text-center text-muted">No ticket selected.</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Ticket Modal -->
  <div class="modal fade" id="editTicketModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Ticket</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div v-if="editTicketData">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input class="form-control" v-model="editTicketData.title" />
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="editTicketData.status">
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Priority</label>
              <select class="form-select" v-model="editTicketData.priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div v-else class="text-center text-muted">No ticket selected.</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="confirmEdit">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'

// State
const tickets = ref([])
const agents = ref([])
const showFilters = ref(false)
const selectedTickets = ref([])
const selectAll = ref(false)
const currentTicket = ref(null)
const selectedAgentId = ref('')

// Modals
let assignModal = null

// Filters
const filters = ref({
  status: '',
  priority: '',
  agent: '',
  dateRange: 'week'
})

// Pagination
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 0,
  lastPage: 1,
  pages: []
})

// Computed
const filteredTickets = computed(() => {
  return tickets.value
})

// Modals
const viewTicketModal = ref(null)
const editTicketModal = ref(null)
const editTicketData = ref(null)

// Methods
function getStatusBadgeClass(status) {
  const classes = {
    'open': 'bg-warning',
    'in-progress': 'bg-info',
    'resolved': 'bg-success',
    'closed': 'bg-secondary'
  }
  return classes[status?.toLowerCase()] || 'bg-secondary'
}

function getPriorityBadgeClass(priority) {
  const classes = {
    'low': 'bg-success',
    'medium': 'bg-info',
    'high': 'bg-warning',
    'urgent': 'bg-danger'
  }
  return classes[priority?.toLowerCase()] || 'bg-secondary'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

function viewTicket(id) {
  const t = tickets.value.find(x => x.id === id)
  viewTicketModal.value = t || { id }
  const el = document.getElementById('viewTicketModal')
  if (el) {
    const m = new Modal(el)
    m.show()
    // store modal instance to hide later if needed
    viewTicketModal._instance = m
  }
}

function editTicket(ticket) {
  editTicketData.value = { ...ticket }
  const el = document.getElementById('editTicketModal')
  if (el) {
    const m = new Modal(el)
    m.show()
    editTicketModal._instance = m
  }
}

function confirmEdit() {
  if (!editTicketData.value) return
  const idx = tickets.value.findIndex(t => t.id === editTicketData.value.id)
  if (idx !== -1) {
    tickets.value[idx] = { ...tickets.value[idx], ...editTicketData.value }
  }
  if (editTicketModal._instance) editTicketModal._instance.hide()
  editTicketData.value = null
}

function deleteTicket(id) {
  if (confirm('Are you sure you want to delete this ticket?')) {
    tickets.value = tickets.value.filter(t => t.id !== id)
  }
}

function assignTicket(ticket) {
  currentTicket.value = ticket
  assignModal.show()
}

function reassignTicket(ticket) {
  currentTicket.value = ticket
  assignModal.show()
}

function confirmAssign() {
  if (currentTicket.value && selectedAgentId.value) {
    const agent = agents.value.find(a => a.id === selectedAgentId.value)
    currentTicket.value.agent = agent.name
    assignModal.hide()
    selectedAgentId.value = ''
    currentTicket.value = null
  }
}

function toggleAll() {
  if (selectAll.value) {
    selectedTickets.value = tickets.value.map(t => t.id)
  } else {
    selectedTickets.value = []
  }
}

function bulkAssign() {
  console.log('Bulk assign tickets:', selectedTickets.value)
}

function bulkUpdateStatus() {
  console.log('Bulk update status:', selectedTickets.value)
}

function bulkDelete() {
  if (confirm(`Delete ${selectedTickets.value.length} tickets?`)) {
    tickets.value = tickets.value.filter(t => !selectedTickets.value.includes(t.id))
    selectedTickets.value = []
  }
}

function exportTickets() {
  // Build CSV rows from tickets
  if (!tickets.value || tickets.value.length === 0) return
  const cols = ['id','title','user','category','status','priority','agent','created_at','updated_at']
  const rows = tickets.value.map(t => ({
    id: t.id,
    title: t.title,
    user: t.user || '',
    category: t.category || '',
    status: t.status || '',
    priority: t.priority || '',
    agent: t.agent || '',
    created_at: t.created_at || '',
    updated_at: t.updated_at || ''
  }))
  downloadCSV('tickets.csv', cols, rows)
}

function downloadCSV(filename, columns, data) {
  const esc = v => String(v ?? '').replace(/"/g, '""')
  const header = columns.join(',')
  const body = data.map(r => columns.map(c => `"${esc(r[c])}"`).join(',')).join('\n')
  const csv = header + '\n' + body
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function applyFilters() {
  console.log('Applying filters:', filters.value)
}

function resetFilters() {
  filters.value = {
    status: '',
    priority: '',
    agent: '',
    dateRange: 'week'
  }
}

function changePage(page) {
  pagination.value.page = page
  loadTickets()
}

// Load data
async function loadTickets() {
  try {
    // Mock data
    tickets.value = [
      { id: 'T123', title: 'Cannot connect to VPN', user: 'John Smith', category: 'Network', status: 'open', priority: 'high', agent: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'T124', title: 'Laptop not charging', user: 'Sarah Johnson', category: 'Hardware', status: 'in-progress', priority: 'medium', agent: 'Mike Wilson', created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString() },
      { id: 'T125', title: 'Email not syncing', user: 'Tom Brown', category: 'Software', status: 'resolved', priority: 'low', agent: 'Jane Smith', created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString() },
      { id: 'T126', title: 'Printer not working', user: 'Alice White', category: 'Hardware', status: 'open', priority: 'medium', agent: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'T127', title: 'Software installation required', user: 'Bob Black', category: 'Software', status: 'open', priority: 'low', agent: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ]
    
    pagination.value.total = tickets.value.length
    pagination.value.lastPage = Math.ceil(pagination.value.total / pagination.value.perPage)
    pagination.value.pages = Array.from({ length: pagination.value.lastPage }, (_, i) => i + 1)
    pagination.value.start = ((pagination.value.page - 1) * pagination.value.perPage) + 1
    pagination.value.end = Math.min(pagination.value.page * pagination.value.perPage, pagination.value.total)
    
  } catch (error) {
    console.error('Error loading tickets:', error)
  }
}

async function loadAgents() {
  try {
    agents.value = [
      { id: 1, name: 'John Doe', email: 'john@example.com', ticketCount: 5 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', ticketCount: 3 },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', ticketCount: 7 }
    ]
  } catch (error) {
    console.error('Error loading agents:', error)
  }
}

onMounted(() => {
  loadTickets()
  loadAgents()
  
  // Initialize modal
  const modalElement = document.getElementById('assignModal')
  if (modalElement) {
    assignModal = new Modal(modalElement)
  }
})
</script>

<style scoped>
.admin-tickets {
  padding: 0;
}

.bulk-actions-bar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  min-width: 600px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.badge {
  padding: 6px 10px;
  font-weight: 500;
}

.table th {
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa;
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
}

.pagination {
  margin: 0;
}

.page-link {
  padding: 0.375rem 0.75rem;
}
</style>