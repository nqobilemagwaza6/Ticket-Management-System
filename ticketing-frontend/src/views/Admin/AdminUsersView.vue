<template>
  <div class="admin-users">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold">User Management</h2>
        <p class="text-muted">Manage system users and their roles</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="exportUsers">
          <i class="bi bi-download me-2"></i>Export
        </button>
        <button class="btn btn-primary" @click="showAddUserModal">
          <i class="bi bi-plus-circle me-2"></i>Add User
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Search users..." v-model="searchQuery">
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="roleFilter">
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="statusFilter">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="resetFilters">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Tickets Created</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="selectedUsers" :value="user.id">
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2" :class="'bg-' + getAvatarColor(user.id)">
                      {{ user.name.charAt(0) }}
                    </div>
                    {{ user.name }}
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" :class="getRoleBadgeClass(user.role)">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="user.active ? 'bg-success' : 'bg-secondary'">
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ user.lastActive || 'Never' }}</td>
                <td>{{ user.ticketCount || 0 }}</td>
                <td>{{ formatDate(user.created_at) }}</td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="editUser(user)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" @click="changeRole(user)">
                      <i class="bi bi-shield"></i>
                    </button>
                    <button class="btn btn-sm" :class="user.active ? 'btn-outline-danger' : 'btn-outline-success'" @click="toggleUserStatus(user)">
                      <i :class="user.active ? 'bi bi-pause-circle' : 'bi bi-play-circle'"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="9" class="text-center py-4 text-muted">
                  No users found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div class="modal fade" id="userModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingUser ? 'Edit User' : 'Add New User' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" v-model="userForm.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="userForm.email" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Role</label>
                <select class="form-select" v-model="userForm.role" required>
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div v-if="!editingUser" class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="userForm.password" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveUser">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Role Modal -->
    <div class="modal fade" id="roleModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Change User Role</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Change role for <strong>{{ roleUser?.name }}</strong></p>
            <select class="form-select" v-model="newRole">
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="confirmRoleChange">Update Role</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'

// State
const users = ref([])
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const selectedUsers = ref([])
const selectAll = ref(false)
const editingUser = ref(null)
const roleUser = ref(null)
const newRole = ref('')

// Form state
const userForm = ref({
  name: '',
  email: '',
  role: 'user',
  password: ''
})

// Modals
let userModal = null
let roleModal = null

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    )
  }

  if (roleFilter.value) {
    filtered = filtered.filter(u => u.role === roleFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(u => 
      statusFilter.value === 'active' ? u.active : !u.active
    )
  }

  return filtered
})

// Methods
function getAvatarColor(id) {
  const colors = ['primary', 'success', 'warning', 'info', 'danger']
  return colors[id % colors.length]
}

function getRoleBadgeClass(role) {
  const classes = {
    'admin': 'bg-danger',
    'agent': 'bg-info',
    'user': 'bg-primary'
  }
  return classes[role] || 'bg-secondary'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

function toggleAll() {
  if (selectAll.value) {
    selectedUsers.value = filteredUsers.value.map(u => u.id)
  } else {
    selectedUsers.value = []
  }
}

function showAddUserModal() {
  editingUser.value = null
  userForm.value = { name: '', email: '', role: 'user', password: '' }
  userModal.show()
}

function editUser(user) {
  editingUser.value = user
  userForm.value = { ...user }
  userModal.show()
}

function saveUser() {
  if (editingUser.value) {
    // Update existing user
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    users.value[index] = { ...editingUser.value, ...userForm.value }
  } else {
    // Add new user
    const newUser = {
      id: users.value.length + 1,
      ...userForm.value,
      active: true,
      ticketCount: 0,
      created_at: new Date().toISOString()
    }
    users.value.push(newUser)
  }
  userModal.hide()
}

function changeRole(user) {
  roleUser.value = user
  newRole.value = user.role
  roleModal.show()
}

function confirmRoleChange() {
  if (roleUser.value) {
    roleUser.value.role = newRole.value
    roleModal.hide()
  }
}

function toggleUserStatus(user) {
  user.active = !user.active
}

function exportUsers() {
  if (!users.value || users.value.length === 0) return
  const cols = ['id','name','email','role','active','lastActive','ticketCount','created_at']
  const rows = users.value.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    active: u.active ? 'Active' : 'Inactive',
    lastActive: u.lastActive || '',
    ticketCount: u.ticketCount || 0,
    created_at: u.created_at || ''
  }))
  downloadCSV('users.csv', cols, rows)
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

function resetFilters() {
  searchQuery.value = ''
  roleFilter.value = ''
  statusFilter.value = ''
}

// Load data
async function loadUsers() {
  try {
    users.value = [
      { id: 1, name: 'John Smith', email: 'john@example.com', role: 'user', active: true, lastActive: '2024-01-15', ticketCount: 5, created_at: '2023-12-01' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'agent', active: true, lastActive: '2024-01-15', ticketCount: 12, created_at: '2023-11-15' },
      { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'agent', active: true, lastActive: '2024-01-14', ticketCount: 8, created_at: '2023-11-20' },
      { id: 4, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', active: true, lastActive: '2024-01-15', ticketCount: 0, created_at: '2023-10-01' },
      { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'user', active: false, lastActive: '2024-01-10', ticketCount: 3, created_at: '2023-12-10' }
    ]
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

onMounted(() => {
  loadUsers()
  
  // Initialize modals
  userModal = new Modal(document.getElementById('userModal'))
  roleModal = new Modal(document.getElementById('roleModal'))
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

.btn-group .btn {
  padding: 0.25rem 0.5rem;
}
</style>