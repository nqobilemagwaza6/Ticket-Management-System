<template>
  <div class="admin-agents">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Agent Management</h2>
        <p class="text-muted">Manage support agents and their performance</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="exportAgentReport">
          <i class="bi bi-download me-2"></i>Export Report
        </button>
        <button class="btn btn-primary" @click="showAddAgentModal">
          <i class="bi bi-plus-circle me-2"></i>Add Agent
        </button>
      </div>
    </div>

    <!-- Performance Overview -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h6 class="text-muted mb-2">Total Agents</h6>
            <h3 class="fw-bold mb-0">{{ stats.totalAgents }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h6 class="text-muted mb-2">Active Agents</h6>
            <h3 class="fw-bold mb-0">{{ stats.activeAgents }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h6 class="text-muted mb-2">Tickets Assigned</h6>
            <h3 class="fw-bold mb-0">{{ stats.totalAssigned }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h6 class="text-muted mb-2">Avg. Resolution Time</h6>
            <h3 class="fw-bold mb-0">{{ stats.avgResolutionTime }}h</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Agents Table -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Agent</th>
                <th>Email</th>
                <th>Status</th>
                <th>Tickets Assigned</th>
                <th>Resolved</th>
                <th>In Progress</th>
                <th>Resolution Rate</th>
                <th>Avg Response Time</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="agent in agents" :key="agent.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2" :class="'bg-' + getAvatarColor(agent.id)">
                      {{ (agent.name || agent.first_name || '?').charAt(0).toUpperCase() }}
                    </div>
                    {{ agent.name }}
                  </div>
                </td>
                <td>{{ agent.email }}</td>
                <td>
                  <span class="badge" :class="agent.active ? 'bg-success' : 'bg-secondary'">
                    {{ agent.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ agent.ticketCount }}</td>
                <td>{{ agent.resolvedCount }}</td>
                <td>{{ agent.inProgressCount }}</td>
                <td>{{ agent.resolutionRate }}%</td>
                <td>{{ agent.avgResponseTime }}h</td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="progress flex-grow-1" style="height: 6px;">
                      <div class="progress-bar" :class="getPerformanceClass(agent.performance)" :style="{ width: agent.performance + '%' }"></div>
                    </div>
                    <span class="small">{{ agent.performance }}%</span>
                  </div>
                </td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="editAgent(agent)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" @click="viewAgentTickets(agent)">
                      <i class="bi bi-ticket"></i>
                    </button> 
                  <button class="btn btn-sm" :class="agent.active ? 'btn-outline-warning' : 'btn-outline-success'" @click="toggleAgentStatus(agent)">
                    <i :class="agent.active ? 'bi bi-pause-circle' : 'bi bi-play-circle'"></i>
                  </button> 
                  </div> 
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Agent Modal -->
    <div class="modal fade" id="agentModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingAgent ? 'Edit Agent' : 'Add New Agent' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAgent">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" v-model="agentForm.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="agentForm.email" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Department</label>
                <select class="form-select" v-model="agentForm.department">
                  <option value="IT">IT Support</option>
                  <option value="Network">Network</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Max Concurrent Tickets</label>
                <input type="number" class="form-control" v-model="agentForm.maxTickets" min="1" max="20">
              </div>
              <div v-if="!editingAgent" class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="agentForm.password" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveAgent">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Agent Tickets Modal -->
  <div class="modal fade" id="agentTicketsModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tickets for {{ currentAgent?.name }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in agentTickets" :key="t.id">
                  <td>#{{ t.id }}</td>
                  <td>{{ t.title }}</td>
                  <td>{{ t.user || 'N/A' }}</td>
                  <td>{{ t.status || 'N/A' }}</td>
                  <td>{{ t.agent || 'Unassigned' }}</td>
                  <td>
                    <button v-if="!t.agent" class="btn btn-sm btn-primary" @click="assignTicketToAgent(t)">
                      Assign to {{ currentAgent.name }}
                    </button>
                    <span v-else class="text-muted small">Assigned</span>
                  </td>
                </tr>
                <tr v-if="agentTickets.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">No tickets found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'

// State
const agents = ref([])
const allTickets = ref([])
const agentTickets = ref([])
const currentAgent = ref(null)
const editingAgent = ref(null)

// Stats
const stats = ref({
  totalAgents: 0,
  activeAgents: 0,
  totalAssigned: 0,
  avgResolutionTime: 0
})

// Form state
const agentForm = ref({
  name: '',
  email: '',
  department: 'IT',
  maxTickets: 10,
  password: ''
})

// Modal
let agentModal = null

// Methods
function getAvatarColor(id) {
  const colors = ['primary', 'success', 'warning', 'info', 'danger']
  return colors[id % colors.length]
}

function getPerformanceClass(performance) {
  if (performance >= 90) return 'bg-success'
  if (performance >= 70) return 'bg-info'
  if (performance >= 50) return 'bg-warning'
  return 'bg-danger'
}

function showAddAgentModal() {
  editingAgent.value = null
  agentForm.value = {
    name: '',
    email: '',
    department: 'IT',
    maxTickets: 10,
    password: ''
  }
  agentModal.show()
}

function editAgent(agent) {
  editingAgent.value = agent
  agentForm.value = { ...agent }
  agentModal.show()
}

function saveAgent() {
  if (editingAgent.value) {
    // Update existing agent
    const index = agents.value.findIndex(a => a.id === editingAgent.value.id)
    agents.value[index] = { ...editingAgent.value, ...agentForm.value }
  } else {
    // Add new agent
    const newAgent = {
      id: agents.value.length + 1,
      ...agentForm.value,
      active: true,
      ticketCount: 0,
      resolvedCount: 0,
      inProgressCount: 0,
      resolutionRate: 0,
      avgResponseTime: 0,
      performance: 0
    }
    agents.value.push(newAgent)
  }
  updateStats()
  agentModal.hide()
}

async function toggleAgentStatus(agent) {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://127.0.0.1:8000/api/deactivate_user/${agent.id}/`, {
      method: 'POST',  // POST request to deactivate/activate the agent
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()

    if (res.ok) {
      agent.active = data.is_active // Update agent's active status based on the response
      Swal.fire({
        icon: 'success',
        title: `Agent ${agent.active ? 'Activated' : 'Deactivated'}`,
        text: `${agent.name} is now ${agent.active ? 'Active' : 'Inactive'}`,
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      console.error('Failed to update agent status:', data)
    }
  } catch (e) {
    console.error('Error toggling agent status:', e)
  }
}


function viewAgentTickets(agent) {
  // Populate modal with tickets assigned to this agent and unassigned tickets
  currentAgent.value = agent
  agentTickets.value = allTickets.value.filter(t => t.agent === agent.name || !t.agent)
  const el = document.getElementById('agentTicketsModal')
  if (el) {
    const m = new Modal(el)
    m.show()
    // store instance if needed
    agentTickets._instance = m
  }
}

function exportAgentReport() {
  if (!agents.value || agents.value.length === 0) return
  const cols = ['id','name','email','department','active','ticketCount','resolvedCount','inProgressCount','resolutionRate','avgResponseTime','performance']
  const rows = agents.value.map(a => ({
    id: a.id,
    name: a.name,
    email: a.email,
    department: a.department || '',
    active: a.active ? 'Active' : 'Inactive',
    ticketCount: a.ticketCount || 0,
    resolvedCount: a.resolvedCount || 0,
    inProgressCount: a.inProgressCount || 0,
    resolutionRate: a.resolutionRate || 0,
    avgResponseTime: a.avgResponseTime || '',
    performance: a.performance || 0
  }))
  downloadCSV('agents.csv', cols, rows)
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
    

function updateStats() {
  stats.value.totalAgents = agents.value.length
  stats.value.activeAgents = agents.value.filter(a => a.active).length
  stats.value.totalAssigned = agents.value.reduce((sum, a) => sum + a.ticketCount, 0)
  
  const avgTime = agents.value.reduce((sum, a) => sum + a.avgResponseTime, 0)
  stats.value.avgResolutionTime = agents.value.length ? (avgTime / agents.value.length).toFixed(1) : 0
}

function assignTicketToAgent(ticket) {
  if (!currentAgent.value || !ticket) return
  // if ticket already assigned, skip
  if (ticket.agent === currentAgent.value.name) return
  // assign
  ticket.agent = currentAgent.value.name
  const a = agents.value.find(x => x.id === currentAgent.value.id)
  if (a) a.ticketCount = (a.ticketCount || 0) + 1
  // remove unassigned-only entries from modal list
  agentTickets.value = agentTickets.value.filter(t => t.id !== ticket.id || t.agent === currentAgent.value.name)
  updateStats()
}

// Load data
async function loadAgents() {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://127.0.0.1:8000/api/users_list/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
    
    const data = await res.json()
    if (!res.ok) {
      console.error('Error fetching agents:', data)
      return
    }

    // Only include support agents
    agents.value = data.filter(user => user.role === 'Support')

    // Add missing fields for table calculations
    agents.value = agents.value.map(a => ({
      ticketCount: 0,
      resolvedCount: 0,
      inProgressCount: 0,
      resolutionRate: 0,
      avgResponseTime: 0,
      performance: 0,
      maxTickets: 10,
      active: a.is_active ?? true,
      ...a
    }))

    updateStats()
  } catch (error) {
    console.error('Error loading agents:', error)
  }
}


// Load mock tickets for assignment modal
async function loadMockTickets() {
  allTickets.value = [
    { id: 'T123', title: 'Cannot connect to VPN', user: 'John Smith', status: 'open', agent: null },
    { id: 'T124', title: 'Laptop not charging', user: 'Sarah Johnson', status: 'in-progress', agent: 'Mike Johnson' },
    { id: 'T125', title: 'Email not syncing', user: 'Tom Brown', status: 'resolved', agent: 'Jane Smith' },
    { id: 'T126', title: 'Printer not working', user: 'Alice White', status: 'open', agent: null }
  ]
}

onMounted(() => {
  loadAgents()
  agentModal = new Modal(document.getElementById('agentModal'))
  loadMockTickets()
})
</script>

<style scoped>
.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
}

.badge {
  padding: 6px 10px;
  font-weight: 500;
}

.progress {
  background-color: #e9ecef;
  border-radius: 4px;
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
}

.card {
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
</style>