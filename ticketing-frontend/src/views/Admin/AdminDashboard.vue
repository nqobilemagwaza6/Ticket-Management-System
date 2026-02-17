<template>
  <div class="d-flex" style="min-height: 100vh; font-family: 'Inter', sans-serif;">

    <!-- Sidebar -->
    <div :class="['sidebar', { collapsed: isCollapsed }]" style="background-color:#2E2E2E;">
      <div class="sidebar-header d-flex justify-content-between align-items-center p-3">
        <h3 v-if="!isCollapsed" style="color:#1ABC9C;">Admin Panel</h3>
        <button class="btn btn-sm btn-outline-light" @click="toggleSidebar">
          <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>
      <ul class="nav flex-column mt-4">
        <li class="nav-item" v-for="item in menuItems" :key="item.name">
          <a href="#" 
             class="nav-link d-flex align-items-center"
             :class="{ active: activeMenu===item.key }"
             @click="activeMenu = item.key">
            <i :class="[item.icon, 'me-2']"></i>
            <span v-if="!isCollapsed">{{ item.name }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1 p-4" style="background-color:#ECEFF1;">
      
      <!-- Dashboard -->
      <div v-if="activeMenu==='dashboard'">
        <h2 style="color:#2E2E2E;" class="mb-4">Admin Dashboard</h2>
        <div class="row g-3 mb-5">
          <div class="col-md-2" v-for="card in statsCards" :key="card.title">
            <div class="card shadow-sm text-center stats-card">
              <div class="card-body d-flex flex-column align-items-center justify-content-center">
                <i :class="card.icon" style="font-size:24px; margin-bottom:8px; color:#2E2E2E;"></i>
                <h5 class="card-title fw-bold mb-1">{{ card.value }}</h5>
                <small>{{ card.title }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management -->
      <div v-if="activeMenu==='users'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 style="color:#2E2E2E;">User Management</h4>
          <button class="btn" style="background-color:#1ABC9C; color:#F5F5F5; border:none;"
                  @click="openAddUserModal">
            Add User
          </button>
        </div>

        <div class="table-responsive shadow-sm rounded">
          <table class="table mb-0" style="background-color:#2E2E2E; color:#F5F5F5;">
            <thead style="background-color:#1ABC9C; color:#F5F5F5;">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index" class="table-row">
                <td>{{ index + 1 }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <span :class="{'text-success': user.active, 'text-danger': !user.active}">
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-outline-light btn-sm me-1" @click="openEditUserModal(index)">Edit</button>
                  <button class="btn btn-outline-danger btn-sm" @click="deleteUser(index)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Ticket Management -->
      <div v-if="activeMenu==='tickets'">
        <h4 class="mb-3" style="color:#2E2E2E;">Ticket Management</h4>
        <div class="table-responsive shadow-sm rounded">
          <table class="table mb-0" style="background-color:#2E2E2E; color:#F5F5F5;">
            <thead style="background-color:#1ABC9C; color:#F5F5F5;">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Category</th>
                <th>Assigned Agent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ticket, index) in tickets" :key="index" class="table-row">
                <td>{{ index + 1 }}</td>
                <td>{{ ticket.title }}</td>
                <td>{{ ticket.priority }}</td>
                <td>{{ ticket.status }}</td>
                <td>{{ ticket.category || 'Uncategorized' }}</td>
                <td>{{ ticket.agent || 'Unassigned' }}</td>
                <td>
                  <button class="btn btn-outline-warning btn-sm me-1" @click="assignTicket(index)">Assign</button>
                  <button class="btn btn-outline-info btn-sm" @click="categorizeTicket(index)">Categorize</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Modals -->
    <UserModal 
      v-if="showAddUserModal" 
      @close="showAddUserModal=false" 
      @save="saveNewUser" 
    />

    <UserModal 
      v-if="showEditUserModal" 
      :user="userToEdit" 
      :isEdit="true"
      @close="showEditUserModal=false" 
      @save="saveEditedUser" 
    />

    <!-- Ticket modal placeholder (optional) -->
    <TicketModal
      v-if="showTicketModal"
      :ticket="currentTicket"
      :isAssign="isAssignAction"
      @close="closeTicketModal"
      @save="saveTicketAction"
    />

  </div>
</template>

<script setup>
import { ref, reactive,onMounted } from 'vue'
import UserModal from '@/components/UserModal.vue'
import TicketModal from '@/components/TicketModal.vue'

// Sidebar
const isCollapsed = ref(false)
const toggleSidebar = () => { isCollapsed.value = !isCollapsed.value }

const activeMenu = ref('dashboard')
const menuItems = [
  { name: 'Admin Dashboard', key: 'dashboard', icon: 'fas fa-tachometer-alt' },
  { name: 'User Management', key: 'users', icon: 'fas fa-users' },
  { name: 'Ticket Management', key: 'tickets', icon: 'fas fa-ticket-alt' },
]

// Stats Cards
const statsCards = [
  { title: 'Total Tickets', value: 32, icon: 'fas fa-tasks' },
  { title: 'Open', value: 12, icon: 'fas fa-folder-open' },
  { title: 'In Progress', value: 8, icon: 'fas fa-spinner' },
  { title: 'Resolved', value: 12, icon: 'fas fa-check-circle' },
  { title: 'Unassigned', value: 5, icon: 'fas fa-user-slash' },
]

// Users
const users = ref([])

onMounted(() => {
  fetchUsers()
})

const fetchUsers = async () => {
  try {
    // Grab CSRF token from cookie (needed for session-protected endpoints)
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1]

    const response = await fetch('http://localhost:8000/api/users_list/', {
      method: 'GET',
      credentials: 'include', // VERY IMPORTANT for session auth
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      }
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to fetch users')
    }

    const data = await response.json()

    // Map backend fields to frontend fields
    users.value = data.map(user => ({
      id: user.id,
      name: user.full_name || user.first_name || user.name,
      email: user.email,
      role: user.role,
      active: user.is_active
    }))

  } catch (error) {
    console.error('Error fetching users:', error)
  }
}


// Tickets
const tickets = reactive([
  { title: 'Cannot login', priority: 'High', status: 'Open', category: null, agent: null },
  { title: 'Printer not working', priority: 'Medium', status: 'In Progress', category: 'Hardware', agent: 'Bob Support' },
])

// ---------- User Modals ----------
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const userToEdit = reactive({ name:'', email:'', role:'User', active:true })
const editUserIndex = ref(null)

const openAddUserModal = () => showAddUserModal.value = true

const saveNewUser = (user) => {
  users.push({ ...user, active:true })
  showAddUserModal.value = false
}

const openEditUserModal = (index) => {
  editUserIndex.value = index
  Object.assign(userToEdit, users[index])
  showEditUserModal.value = true
}

const saveEditedUser = (updatedUser) => {
  if(editUserIndex.value !== null){
    users[editUserIndex.value] = { ...updatedUser }
  }
  showEditUserModal.value = false
}

const deleteUser = (index) => users.splice(index,1)

// ---------- Ticket Modals ----------
const showTicketModal = ref(false)
const currentTicket = reactive({})
const isAssignAction = ref(true)

const assignTicket = (index) => {
  Object.assign(currentTicket, tickets[index])
  isAssignAction.value = true
  showTicketModal.value = true
}
const categorizeTicket = (index) => {
  Object.assign(currentTicket, tickets[index])
  isAssignAction.value = false
  showTicketModal.value = true
}
const closeTicketModal = () => showTicketModal.value = false
const saveTicketAction = (updatedTicket) => {
  const index = tickets.findIndex(t => t === currentTicket)
  if(index !== -1) tickets[index] = {...updatedTicket}
  closeTicketModal()
}
</script>

<style scoped>
/* Sidebar */
.sidebar {
  width: 250px;
  transition: width 0.3s;
  min-height: 100vh;
  color: #F5F5F5;
}
.sidebar.collapsed { width:70px; }
.sidebar .nav-link { color:#F5F5F5; margin-bottom:6px; border-radius:8px; transition:0.2s; }
.sidebar .nav-link.active, .sidebar .nav-link:hover { background-color:#1ABC9C; color:#FFF; }

/* Stats Cards */
.stats-card {
  background: linear-gradient(135deg, #F9E79F, #FAD02E);
  border-radius:12px;
  color:#2E2E2E;
  padding:1rem;
}

/* Table Hover */
.table-row:hover { background-color:#3B3B3B; transition:0.2s; }

/* Buttons */
.btn-outline-light { border-color:#1ABC9C; color:#1ABC9C; }
.btn-outline-light:hover { background-color:#1ABC9C; color:#F5F5F5; }
.btn-outline-danger:hover { background-color:#FF6B35;color:#F5F5F5;border-color:#FF6B35; }
.btn-outline-warning:hover { background-color:#FF6B35;color:#F5F5F5;border-color:#FF6B35; }
.btn-outline-info:hover { background-color:#F9E79F;color:#2E2E2E;border-color:#F9E79F; }
</style>
