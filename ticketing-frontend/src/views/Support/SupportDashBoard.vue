
 <template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">Support Agent</h2>
        <p class="text-muted mb-0">Agent Dashboard</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-md-3" v-for="stat in statsArray" :key="stat.label">
          <div class="card text-center shadow-sm">
            <div class="card-body">
              <p class="text-uppercase text-secondary mb-2">{{ stat.label }}</p>
              <h3 class="fw-bold">{{ stat.value }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Tickets List -->
      <div>
        <h4 class="mb-3">Assigned Tickets</h4>
        <ul class="list-group">
          <li
            v-for="ticket in assignedTickets"
            :key="ticket.id"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            @click="selectTicket(ticket)"
            style="cursor:pointer"
          >
            <div>
              <strong>#{{ ticket.number }}</strong> - {{ ticket.submittedBy }}
            </div>
            <span class="badge rounded-pill" :class="ticketCategoryClass(ticket.category)">
              {{ ticket.category }}
            </span>
          </li>
        </ul>
      </div>
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

const loading = ref(true)
const tickets = ref([])

// --- Dummy Tickets (always show them) ---
tickets.value = [
  {
    id: 1,
    number: 'TT1125845',
    submittedBy: 'John Doe',
    createdAt: '2026-02-16T10:18:00',
    category: 'Software',
    assignedTo: 'Agent Smith',
    lastUpdated: '2026-02-16T11:01:00',
    description: 'App logs out every time I try to use it',
    status: 'In Progress'
  },
  {
    id: 2,
    number: 'TT1125846',
    submittedBy: 'Jane Roe',
    createdAt: '2026-02-16T09:30:00',
    category: 'Hardware',
    assignedTo: 'Agent Smith',
    lastUpdated: '2026-02-16T10:45:00',
    description: 'Monitor flickering when powered on',
    status: 'Open'
  },
  {
    id: 3,
    number: 'TT1125847',
    submittedBy: 'Alice Lee',
    createdAt: '2026-02-15T14:20:00',
    category: 'Network',
    assignedTo: 'Agent Smith',
    lastUpdated: '2026-02-16T08:15:00',
    description: 'Cannot connect to VPN',
    status: 'Resolved'
  }
]

// --- Use all tickets for testing (ignore localStorage user) ---
const assignedTickets = computed(() => tickets.value)

const statsArray = computed(() => {
  const assigned = assignedTickets.value
  return [
    { label: 'Assigned Tickets', value: assigned.length },
    { label: 'Open', value: assigned.filter(t => t.status === 'Open').length },
    { label: 'In Progress', value: assigned.filter(t => t.status === 'In Progress').length },
    { label: 'Resolved', value: assigned.filter(t => t.status === 'Resolved').length }
  ]
})

const selectedTicket = ref(null)
function selectTicket(ticket) { selectedTicket.value = { ...ticket } }
function closeModal() { selectedTicket.value = null }

function ticketCategoryClass(category) {
  switch (category.toLowerCase()) {
    case 'software': return 'bg-primary text-white'
    case 'hardware': return 'bg-warning text-dark'
    case 'network': return 'bg-info text-white'
    default: return 'bg-secondary text-white'
  }
}

const formatDateTime = (d) => new Date(d).toLocaleString()
function markResolved() { alert('Ticket marked resolved'); closeModal() }
function addComment() {
  const comment = prompt('Add your comment:')
  if (comment) console.log('Comment added:', comment)
}

onMounted(() => setTimeout(() => { loading.value = false }, 300))
</script>

<style scoped>
.modal-body { max-height: 60vh; overflow-y: auto; }
</style>
