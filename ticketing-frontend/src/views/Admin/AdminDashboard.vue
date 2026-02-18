<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Admin Dashboard</h2>
        <p class="text-muted">Welcome Admin! Here's what's happening with your support system.</p>
      </div>
    
    </div>
    
    <!-- Stats Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Total Tickets</h6>
                <h3 class="fw-bold mb-0">{{ stats.total }}</h3>
              </div>
              <div class="stats-icon bg-primary bg-opacity-10">
                <i class="bi bi-ticket-detailed text-primary"></i>
              </div>
            </div>
            <div class="mt-3 text-muted small">
              <span class="text-success">+{{ stats.weeklyGrowth }}%</span> from last week
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Open Tickets</h6>
                <h3 class="fw-bold mb-0">{{ stats.open }}</h3>
              </div>
              <div class="stats-icon bg-warning bg-opacity-10">
                <i class="bi bi-envelope-open text-warning"></i>
              </div>
            </div>
            <div class="mt-3 text-muted small">
              {{ stats.unassigned }} unassigned
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Active Agents</h6>
                <h3 class="fw-bold mb-0">{{ stats.activeAgents }}</h3>
              </div>
              <div class="stats-icon bg-success bg-opacity-10">
                <i class="bi bi-people text-success"></i>
              </div>
            </div>
            <div class="mt-3 text-muted small">
              {{ stats.totalAgents }} total agents
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Resolution Rate</h6>
                <h3 class="fw-bold mb-0">{{ stats.resolutionRate }}%</h3>
              </div>
              <div class="stats-icon bg-info bg-opacity-10">
                <i class="bi bi-check-circle text-info"></i>
              </div>
            </div>
            <div class="mt-3 text-muted small">
              Avg. {{ stats.avgResolutionTime }}h response time
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row g-3 mb-4">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Ticket Volume</h5>
            <select class="form-select form-select-sm w-auto" v-model="chartPeriod">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div class="card-body">
            <div class="chart-placeholder" style="height: 300px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <p class="text-muted mb-0">Chart will be implemented with a charting library</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header bg-white">
            <h5 class="mb-0">Tickets by Category</h5>
          </div>
          <div class="card-body">
            <div v-for="category in categoryStats" :key="category.name" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span>{{ category.name }}</span>
                <span class="text-muted">{{ category.percentage }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar" :class="category.colorClass" :style="{ width: category.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Tickets Table -->
    <div class="card mb-4">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Recent Tickets</h5>
        <router-link to="/admin/tickets" class="btn btn-sm btn-outline-primary">
          View All Tickets <i class="bi bi-arrow-right ms-1"></i>
        </router-link>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>User</th>
                <th>Assigned Agent</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in recentTickets" :key="ticket.id">
                <td><span class="fw-medium">#{{ ticket.id }}</span></td>
                <td>{{ ticket.title }}</td>
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
                <td>{{ ticket.user }}</td>
                <td>
                  <span v-if="ticket.agent">{{ ticket.agent }}</span>
                  <span v-else class="text-muted fst-italic">Unassigned</span>
                </td>
                <td>{{ formatDate(ticket.created_at) }}</td>
                <td>
                  <button class="btn btn-sm btn-link text-primary p-0 me-2" @click="viewTicket(ticket.id)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-link text-warning p-0" @click="assignTicket(ticket.id)">
                    <i class="bi bi-person-plus"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="recentTickets.length === 0">
                <td colspan="9" class="text-center py-4 text-muted">
                  No tickets found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Quick Actions Row -->
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-white">
            <h5 class="mb-0">Pending Agent Assignments</h5>
          </div>
          <div class="card-body">
            <div v-for="ticket in unassignedTickets" :key="ticket.id" class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h6 class="mb-1">#{{ ticket.id }} - {{ ticket.title }}</h6>
                <small class="text-muted">Created by {{ ticket.user }}</small>
              </div>
              <button class="btn btn-sm btn-outline-primary" @click="assignTicket(ticket.id)">
                Assign
              </button>
            </div>
            <div v-if="unassignedTickets.length === 0" class="text-center py-3 text-muted">
              No pending assignments
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-white">
            <h5 class="mb-0">Agent Performance</h5>
          </div>
          <div class="card-body">
            <div v-for="agent in agentPerformance" :key="agent.id" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span>{{ agent.name }}</span>
                <span class="text-muted">{{ agent.completed }} resolved</span>
              </div>
              <div class="progress" style="height: 6px;">
                <div class="progress-bar bg-success" :style="{ width: agent.performance + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- View Ticket Modal -->
  <div class="modal fade" id="dashboardViewModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ticket Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div v-if="selectedTicket">
            <h5 class="mb-2">#{{ selectedTicket.id }} - {{ selectedTicket.title }}</h5>
            <p><strong>User:</strong> {{ selectedTicket.user || 'N/A' }}</p>
            <p><strong>Category:</strong> {{ selectedTicket.category || 'N/A' }}</p>
            <p><strong>Status:</strong> {{ selectedTicket.status || 'N/A' }}</p>
            <p><strong>Priority:</strong> {{ selectedTicket.priority || 'N/A' }}</p>
            <p><strong>Assigned Agent:</strong> {{ selectedTicket.agent || 'Unassigned' }}</p>
            <p><strong>Description:</strong></p>
            <p class="text-muted">{{ selectedTicket.description || 'No description available.' }}</p>
          </div>
          <div v-else class="text-center text-muted">No ticket selected.</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Assign Modal -->
  <div class="modal fade" id="dashboardAssignModal" tabindex="-1">
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
              <option value="">Choose agent</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.id">{{ agent.name }} ({{ agent.ticketCount }})</option>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'

const router = useRouter()

// Admin info
const adminName = ref('Admin')

// Stats
const stats = ref({
  total: 0,
  open: 0,
  resolved: 0,
  weeklyGrowth: 12,
  unassigned: 0,
  activeAgents: 0,
  totalAgents: 0,
  resolutionRate: 0,
  avgResolutionTime: 0
})

// Chart period
const chartPeriod = ref('7')

// Category stats
const categoryStats = ref([
  { name: 'Hardware', percentage: 35, colorClass: 'bg-primary' },
  { name: 'Software', percentage: 45, colorClass: 'bg-info' },
  { name: 'Network', percentage: 15, colorClass: 'bg-warning' },
  { name: 'Other', percentage: 5, colorClass: 'bg-secondary' }
])

// Recent tickets
const recentTickets = ref([])

// Unassigned tickets
const unassignedTickets = ref([])

// Agents (mock)
const agents = ref([
  { id: 1, name: 'John Doe', ticketCount: 5 },
  { id: 2, name: 'Jane Smith', ticketCount: 3 },
  { id: 3, name: 'Mike Johnson', ticketCount: 7 }
])

// Modals & selection
const selectedTicket = ref(null)
const assignTarget = ref(null)
const selectedAgentId = ref('')
let assignModal = null
let viewModal = null

// Agent performance
const agentPerformance = ref([
  { id: 1, name: 'John Doe', completed: 45, performance: 90 },
  { id: 2, name: 'Jane Smith', completed: 38, performance: 76 },
  { id: 3, name: 'Mike Johnson', completed: 52, performance: 95 }
])

// Helper functions
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
    'medium': 'bg-warning',
    'high': 'bg-danger',
    'urgent': 'bg-danger'
  }
  return classes[priority?.toLowerCase()] || 'bg-secondary'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function viewTicket(id) {
  // Show ticket detail modal
  selectedTicket.value = recentTickets.value.find(t => t.id === id) || unassignedTickets.value.find(t => t.id === id) || { id }
  if (viewModal) viewModal.show()
}

function assignTicket(id) {
  // Open assign modal
  assignTarget.value = recentTickets.value.find(t => t.id === id) || unassignedTickets.value.find(t => t.id === id) || { id }
  if (assignModal) assignModal.show()
}

function confirmAssign() {
  if (assignTarget.value && selectedAgentId.value) {
    const a = agents.value.find(x => x.id === selectedAgentId.value)
    if (a) {
      // assign in mock data
      assignTarget.value.agent = a.name
      // remove from unassigned if present
      unassignedTickets.value = unassignedTickets.value.filter(t => t.id !== assignTarget.value.id)
      // ensure it's present in recentTickets
      const exists = recentTickets.value.find(t => t.id === assignTarget.value.id)
      if (!exists) recentTickets.value.unshift(assignTarget.value)
    }
    selectedAgentId.value = ''
    assignTarget.value = null
    if (assignModal) assignModal.hide()
  }
}

function refreshData() {
  // Refresh all data
  loadDashboardData()
}

function exportReport() {
  // Export report logic
  console.log('Exporting report...')
}

// Load dashboard data
async function loadDashboardData() {
  try {
    // Get admin info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    adminName.value = user.name || 'Admin'

    // Fetch stats from API
    /*
    const statsRes = await fetch('/api/admin/stats')
    stats.value = await statsRes.json()

    const recentRes = await fetch('/api/admin/recent-tickets')
    recentTickets.value = await recentRes.json()

    const unassignedRes = await fetch('/api/admin/unassigned-tickets')
    unassignedTickets.value = await unassignedRes.json()
    */

    // Mock data for now
    recentTickets.value = [
      {
        id: 'T123',
        title: 'Cannot connect to VPN',
        category: 'Network',
        status: 'open',
        priority: 'high',
        user: 'John Smith',
        agent: null,
        created_at: new Date().toISOString()
      },
      {
        id: 'T124',
        title: 'Laptop not charging',
        category: 'Hardware',
        status: 'in-progress',
        priority: 'medium',
        user: 'Sarah Johnson',
        agent: 'Mike Wilson',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'T125',
        title: 'Email not syncing',
        category: 'Software',
        status: 'resolved',
        priority: 'low',
        user: 'Tom Brown',
        agent: 'Jane Smith',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]

    unassignedTickets.value = [
      {
        id: 'T126',
        title: 'Printer not working',
        user: 'Alice White'
      },
      {
        id: 'T127',
        title: 'Software installation required',
        user: 'Bob Black'
      }
    ]

    // Update stats based on mock data
    stats.value = {
      ...stats.value,
      total: 156,
      open: 23,
      resolved: 128,
      unassigned: unassignedTickets.value.length,
      activeAgents: 8,
      totalAgents: 12,
      resolutionRate: 82,
      avgResolutionTime: 4.5
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

onMounted(() => {
  loadDashboardData()
  // Initialize Bootstrap modals
  const am = document.getElementById('dashboardAssignModal')
  if (am) assignModal = new Modal(am)
  const vm = document.getElementById('dashboardViewModal')
  if (vm) viewModal = new Modal(vm)
})
</script>

<style scoped>
.stats-card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-icon i {
  font-size: 24px;
}

.card {
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.table th {
  font-weight: 600;
  color: #495057;
  border-bottom-width: 1px;
}

.badge {
  padding: 6px 10px;
  font-weight: 500;
}

.progress {
  background-color: #e9ecef;
  border-radius: 4px;
}

.btn-link {
  text-decoration: none;
}

.btn-link:hover {
  background: rgba(0,0,0,0.02);
}
</style>