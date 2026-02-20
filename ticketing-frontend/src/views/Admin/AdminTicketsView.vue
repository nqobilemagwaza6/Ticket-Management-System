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
                <td data-label="Select">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="selectedTickets" :value="ticket.id">
                  </div>
                </td>
                <td data-label="ID"><span class="fw-medium">#{{ ticket.id }}</span></td>
                <td data-label="Title">
                  <router-link :to="`/admin/tickets/${ticket.id}`" class="text-decoration-none">
                    {{ ticket.title }}
                  </router-link>
                </td>
                <td data-label="User">{{ ticket.user }}</td>
                <td data-label="Category">{{ ticket.category }}</td>
                <td data-label="Status">
                  <span class="badge" :class="getStatusBadgeClass(ticket.status)">
                    {{ ticket.status }}
                  </span>
                </td>
                <td data-label="Priority">
                  <span class="badge" :class="getPriorityBadgeClass(ticket.priority)">
                    {{ ticket.priority }}
                  </span>
                </td>
              <td data-label="Assigned Agent">
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

                <td data-label="Created">{{ formatDate(ticket.created_at) }}</td>
                <td data-label="Last Updated">{{ formatDate(ticket.updated_at) }}</td>
                <td data-label="Actions">
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
                {{ agent.name }} ({{ agent.email }}) — {{ agent.ticketCount }} active tickets
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
            <label class="form-label">Category</label>
            <input class="form-control" v-model="editTicketData.category" />
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

        <div class="mb-3">
          <label class="form-label">Assigned Agent</label>
          <select class="form-select" v-model="editTicketData.assigned_to_id">
            <option :value="null">Unassigned</option>
            <option v-for="agent in agents" :key="agent.id" :value="agent.id">
              {{ agent.name }} ({{ agent.email }})
            </option>
          </select>
        </div>

          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" v-model="editTicketData.description" rows="3"></textarea>
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

const tickets = ref([])
const agents = ref([])
const showFilters = ref(false)
const selectedTickets = ref([])
const selectAll = ref(false)
const currentTicket = ref(null)
const selectedAgentId = ref('')

// Modals
let assignModal = null
const viewTicketModal = ref(null)
const editTicketModal = ref(null)
const editTicketData = ref(null)

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
  pages: [],
  start: 1,
  end: 1
})

// Computed filtered tickets
const filteredTickets = computed(() => {
  let filtered = tickets.value
  if (filters.value.status) {
    filtered = filtered.filter(t => t.status.toLowerCase() === filters.value.status.toLowerCase())
  }
  if (filters.value.priority) {
    filtered = filtered.filter(t => t.priority.toLowerCase() === filters.value.priority.toLowerCase())
  }
  if (filters.value.agent) {
    if (filters.value.agent === 'unassigned') filtered = filtered.filter(t => !t.agent)
    else filtered = filtered.filter(t => t.assigned_to_id === filters.value.agent)
  }

  const start = (pagination.value.page - 1) * pagination.value.perPage
  const end = start + pagination.value.perPage
  pagination.value.total = filtered.length
  pagination.value.lastPage = Math.ceil(filtered.length / pagination.value.perPage)
  pagination.value.pages = Array.from({ length: pagination.value.lastPage }, (_, i) => i + 1)
  pagination.value.start = start + 1
  pagination.value.end = Math.min(end, filtered.length)

  return filtered.slice(start, end)
})

// -------------------- Methods --------------------
function getStatusBadgeClass(status) {
  const classes = { 'open':'bg-warning','in progress':'bg-info','resolved':'bg-success','closed':'bg-secondary' }
  return classes[status?.toLowerCase()] || 'bg-secondary'
}
function getPriorityBadgeClass(priority) {
  const classes = { 'low':'bg-success','medium':'bg-info','high':'bg-warning','urgent':'bg-danger' }
  return classes[priority?.toLowerCase()] || 'bg-secondary'
}
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

// Ticket actions
function viewTicket(id) {
  const t = tickets.value.find(x => x.id === id)
  viewTicketModal.value = t || { id }
  const el = document.getElementById('viewTicketModal')
  if (el) { const m = new Modal(el); m.show(); viewTicketModal._instance = m }
}
function editTicket(ticket) {
  editTicketData.value = {
    ...ticket,
    assigned_to_id: ticket.assigned_to_id || null, // <-- pre-fill assigned agent
  };

  const el = document.getElementById('editTicketModal');
  if (el) {
    const m = new Modal(el);
    m.show();
    editTicketModal._instance = m;
  }
}


async function confirmEdit() {
  if (!editTicketData.value) return;

  const token = localStorage.getItem('token');
  const updated = {
    title: editTicketData.value.title,
    status: editTicketData.value.status,
    priority: editTicketData.value.priority,
    assigned_to: editTicketData.value.assigned_to_id, // send assigned agent ID
  };

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/tickets/${editTicketData.value.id}/`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated),
      }
    );

    if (!res.ok) throw new Error('Update failed');

    await loadTickets(); // refresh table
    if (editTicketModal._instance) editTicketModal._instance.hide();
    editTicketData.value = null;
  } catch (e) {
    console.error('Edit error', e);
  }
}



function assignTicket(ticket){ currentTicket.value=ticket; assignModal.show() }
function reassignTicket(ticket){ currentTicket.value=ticket; assignModal.show() }

async function confirmAssign(){
  if(!currentTicket.value || !selectedAgentId.value) return
  try{
    const token = localStorage.getItem('token')
    const res = await fetch(`http://127.0.0.1:8000/api/tickets/${currentTicket.value.id}/assign/`, {
      method:'PATCH',
      headers:{'Authorization':`Token ${token}`,'Content-Type':'application/json'},
      body:JSON.stringify({ assigned_to: Number(selectedAgentId.value) })
    })
    if(!res.ok) throw new Error('Assign failed')
    await loadTickets()
    assignModal.hide()
    selectedAgentId.value=''
    currentTicket.value=null
  }catch(e){ console.error(e) }
}

// Toggle select all
function toggleAll(){ selectAll.value?selectedTickets.value=tickets.value.map(t=>t.id):selectedTickets.value=[] }
function bulkAssign(){ console.log('Bulk assign', selectedTickets.value) }
function bulkUpdateStatus(){ console.log('Bulk update', selectedTickets.value) }
function bulkDelete(){ if(confirm(`Delete ${selectedTickets.value.length} tickets?`)){ tickets.value=tickets.value.filter(t=>!selectedTickets.value.includes(t.id)); selectedTickets.value=[] } }

// CSV Export
function exportTickets(){ if(!tickets.value.length)return; const cols=['id','title','user','category','status','priority','agent','created_at','updated_at']; const rows=tickets.value.map(t=>({id:t.id,title:t.title,user:t.user||'',category:t.category||'',status:t.status||'',priority:t.priority||'',agent:t.agent||'',created_at:t.created_at||'',updated_at:t.updated_at||''})); downloadCSV('tickets.csv',cols,rows) }
function downloadCSV(filename, columns, data){ const esc=v=>String(v??'').replace(/"/g,'""'); const header=columns.join(','); const body=data.map(r=>columns.map(c=>`"${esc(r[c])}"`).join(',')).join('\n'); const csv=header+'\n'+body; const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url) }

// Filters
function applyFilters(){ pagination.value.page=1 }
function resetFilters(){ filters.value={status:'',priority:'',agent:'',dateRange:'week'} }
function changePage(page){ pagination.value.page=page }

// -------------------- Load Tickets & Agents --------------------
async function loadTickets(){
  try{
    const token=localStorage.getItem('token')
    const res=await fetch('http://127.0.0.1:8000/api/tickets/',{
      method:'GET',
      headers:{'Authorization':`Token ${token}`,'Content-Type':'application/json'}
    })
    if(!res.ok) throw new Error('Tickets fetch failed')
    const data=await res.json()
  tickets.value = data.map(t => ({
    ...t,
    user: t.user?.username || t.user,
    agent: t.agent || null,
    assigned_to_id: t.assigned_to?.id || null,
    status: t.status || 'open',       // default to 'open' if null
    priority: t.priority || 'low'     // default to 'low' if null
  }));

  }catch(e){ console.error('Tickets error', e) }
}


async function loadAgents() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://127.0.0.1:8000/api/users_list/', {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Agents fetch failed');

    const data = await res.json();

    // Filter Support users and show name + email
    agents.value = data
      .filter(u => u.role === 'Support' && u.is_active)
      .map(u => ({
        id: u.id,
        name: (u.first_name || u.last_name) 
                ? `${u.first_name || ''} ${u.last_name || ''}`.trim() 
                : 'No Name',
        email: u.email || 'No Email',
        ticketCount: 0
      }));
  } catch (e) {
    console.error('Agents error', e);
  }
}




// Mounted
onMounted(()=>{
  loadTickets()
  loadAgents()
  const modalEl=document.getElementById('assignModal'); if(modalEl) assignModal=new Modal(modalEl)
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
/* Responsive stacked rows for tickets table on small screens */
@media (max-width: 576px) {
  .table thead { display: none; }
  .table, .table tbody, .table tr, .table td { display: block; width: 100%; }
  .table tr { margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.04); padding: 8px; border-radius: 8px; }
  .table td { display: flex; justify-content: space-between; padding: 8px 12px; border: none; }
  .table td::before { content: attr(data-label); font-weight: 600; color: #6b7280; margin-right: 12px; }
}
</style>