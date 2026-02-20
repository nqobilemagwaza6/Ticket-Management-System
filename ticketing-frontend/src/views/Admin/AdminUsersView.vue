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
              <option value="User">User</option>
              <option value="Support">Support</option>
              <option value="Admin">Admin</option>
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
                <td data-label="Select">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="selectedUsers" :value="user.id">
                  </div>
                </td>
                <td data-label="Name">
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">
                      {{ user.first_name?.charAt(0) || '?' }}
                    </div>
                    <div>
                      {{ user.first_name || 'N/A' }}
                    </div>
                  </div>
                </td>
                <td data-label="Email">{{ user.email }}</td>
                <td data-label="Role">
                  <span class="badge" :class="getRoleBadgeClass(user.role)">
                    {{ user.role }}
                  </span>
                </td>
                <td data-label="Status">
                  <span class="badge" :class="user.is_active ? 'bg-success' : 'bg-danger'">
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td data-label="Last Active">{{ user.last_login ? formatDate(user.last_login) : 'Never' }}</td>
                <td data-label="Tickets Created">{{ user.ticket_count || 0 }}</td>
                <td data-label="Joined Date">{{ formatDate(user.date_joined) }}</td>
                <td data-label="Actions">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="editUser(user)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" @click="changeRole(user)">
                      <i class="bi bi-shield"></i>
                    </button>
                    <button :class="['btn','btn-sm', user.is_active ? 'btn-success' : 'btn-danger', 'text-white']" @click="deactivateUser(user)">
                      <i :class="user.is_active ? 'bi bi-check-circle' : 'bi bi-x-circle'"></i>
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

    <!-- Add User Modal -->
    <div class="modal fade" id="userModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New User</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" v-model="userForm.first_name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="userForm.email" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Role</label>
                <select class="form-select" v-model="userForm.role" required>
                  <option value="User">User</option>
                  <option value="Support">Support</option>
                  <option value="Admin">Admin</option>
                </select>
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
            <p>Change role for <strong>{{ roleUser?.first_name }}</strong></p>
            <select class="form-select" v-model="newRole">
              <option value="User">User</option>
              <option value="Support">Support</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="confirmRoleChange">Update Role</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Edit User Modal -->
<div class="modal fade" id="editUserModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Edit User</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="updateUser">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" v-model="editForm.first_name" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" v-model="editForm.email" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Role</label>
            <select class="form-select" v-model="editForm.role" required>
              <option value="User">User</option>
              <option value="Support">Support</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" @click="updateUser">Update</button>
      </div>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'

// State
const users = ref([])
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const selectedUsers = ref([])
const selectAll = ref(false)
const roleUser = ref(null)
const newRole = ref('')

// Form state
const userForm = ref({
  first_name: '',
  email: '',
  role: 'user'
})

const editForm = ref({
  id: null,
  first_name: '',
  email: '',
  role: ''
})

let editUserModal = null

// Modals
let userModal = null
let roleModal = null

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => 
      u.first_name?.toLowerCase().includes(query) || 
      u.email?.toLowerCase().includes(query)
    )
  }

  if (roleFilter.value) filtered = filtered.filter(u => u.role === roleFilter.value)
  if (statusFilter.value) filtered = filtered.filter(u => statusFilter.value === 'active' ? u.is_active : !u.is_active)

  return filtered
})

// Methods
function getAvatarColor(id) {
  const colors = ['primary', 'success', 'warning', 'info', 'danger']
  return colors[id % colors.length]
}

function getRoleBadgeClass(role) {
  const classes = { 'admin':'bg-danger', 'agent':'bg-info', 'user':'bg-primary' }
  return classes[role] || 'bg-secondary'
}

function formatDate(dateString) {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  return date.toLocaleString(undefined, options)
}


function toggleAll() {
  selectedUsers.value = selectAll.value ? filteredUsers.value.map(u => u.id) : []
}

function showAddUserModal() {
  userForm.value = { first_name: '', email: '', role: 'user' }
  userModal.show()
}

// Save user via backend
async function saveUser() {
  try {
    const token = localStorage.getItem('token')

    // Show SweetAlert immediately (non-blocking)
    const swalPromise = Swal.fire({
      title: 'Creating user...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    })

    // Send POST request
    const res = await fetch('${API_BASE}/api/admin_create_user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(userForm.value)
    })

    // Close loading alert immediately
    Swal.close()

    // Show success/fail alert without waiting for JSON parsing
    if (res.ok) {
      userModal.hide()
      Swal.fire({
        icon: 'success',
        title: 'User Created',
        text: `${userForm.value.first_name} was created!`,
        timer: 2000,
        showConfirmButton: false
      })

      // parse JSON after showing alert
      res.json().then(data => fetchUsers().catch(err => console.error(err)))
    } else {
      // If not OK, parse JSON to show error
      const data = await res.json()
      console.error(data)
      Swal.fire({
        icon: 'error',
        title: 'Failed to create user',
        text: data.detail || 'Please check your input'
      })
    }
  } catch (e) {
    console.error(e)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An unexpected error occurred.'
    })
  }
}



function changeRole(user) {
  roleUser.value = user
  newRole.value = user.role
  roleModal.show()
}
function editUser(user) {
  editForm.value = {
    id: user.id,
    first_name: user.first_name,
    email: user.email,
    role: user.role
  }
  editUserModal.show()
}

async function updateUser() {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(
      `${API_BASE}/api/admin_update_user/${editForm.value.id}/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(editForm.value)
      }
    )

    const data = await res.json()

    if (res.ok) {
      await fetchUsers()
      editUserModal.hide()
      Swal.fire({
        icon: 'success',
        title: 'User Updated',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      console.error(data)
    }
  } catch (e) {
    console.error(e)
  }
}

async function deactivateUser(user) {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE}/api/deactivate_user/${user.id}/`, {
      method: 'POST',  // use POST
      headers: { 'Authorization': `Token ${token}` }
    })

    const data = await res.json()
    if (res.ok) {
      user.is_active = data.is_active
      user.last_login = data.last_login  // update last login in table
      Swal.fire({
        icon: 'success',
        title: `User ${user.is_active ? 'Activated' : 'Deactivated'}`,
        text: `${user.first_name} is now ${user.is_active ? 'Active' : 'Inactive'}`,
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      console.error(data)
    }
  } catch(e) {
    console.error(e)
  }
}

function confirmRoleChange() {
  if (roleUser.value) {
    roleUser.value.role = newRole.value
    roleModal.hide()
  }
}

function toggleUserStatus(user) {
  user.is_active = !user.is_active
}

function exportUsers() {
  if (!users.value.length) return
  const cols = ['id','first_name','email','role','is_active','last_active','ticket_count','created_at']
  const rows = users.value.map(u => ({
    id: u.id,
    first_name: u.first_name,
    email: u.email,
    role: u.role,
    is_active: u.is_active ? 'Active' : 'Inactive',
    last_active: u.last_active || '',
    ticket_count: u.ticket_count || 0,
    created_at: u.created_at || ''
  }))
  const esc = v => String(v ?? '').replace(/"/g, '""')
  const csv = [cols.join(','), ...rows.map(r => cols.map(c => `"${esc(r[c])}"`).join(',')).join('\n')].join('\n')
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'users.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

function resetFilters() {
  searchQuery.value = ''
  roleFilter.value = ''
  statusFilter.value = ''
}

// Fetch users from backend
async function fetchUsers() {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('${API_BASE}/api/users_list/', {
      headers: { 'Authorization': `Token ${token}` }
    })
    const data = await res.json()
    if (res.ok) users.value = data
    else console.error(data)
  } catch(e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchUsers()
  userModal = new Modal(document.getElementById('userModal'))
  roleModal = new Modal(document.getElementById('roleModal'))
  editUserModal = new Modal(document.getElementById('editUserModal'))

})
</script>

<style scoped>
.avatar-circle {
  width: 32px; height: 32px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 500; text-transform: uppercase;
  background-color: var(--accent-orange) !important;
  color: #fff !important;
}
.badge { padding: 6px 10px; font-weight:500; }
.btn-group .btn { padding:0.25rem 0.5rem; }
/* Responsive stacked rows for users table on small screens */
@media (max-width: 576px) {
  .table thead { display: none; }
  .table, .table tbody, .table tr, .table td { display: block; width: 100%; }
  .table tr { margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.04); padding: 8px; border-radius: 8px; }
  .table td { display: flex; justify-content: space-between; padding: 8px 12px; border: none; }
  .table td::before { content: attr(data-label); font-weight: 600; color: #6b7280; margin-right: 12px; }
  .avatar-circle { width: 28px; height: 28px; font-size: 14px; }
}
</style>
