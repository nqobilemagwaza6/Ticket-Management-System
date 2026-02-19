<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #252422;">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/EmployeeDashboard" style="color: #EB5E28;">
        IT Support Portal
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/EmployeeDashboard" active-class="active" style="color: #CCC5B9;">
              Dashboard
            </router-link>
          </li>
         
          <li class="nav-item">
  <router-link class="nav-link" to="/tickets" active-class="active">
    Ticket History 
  </router-link>
</li>
        </ul>
        
        <div class="d-flex align-items-center">
          
          <button @click="logout" class="btn btn-sm" style="background-color: #EB5E28; color: white;">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('User')

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  userName.value = user.full_name || 'User'
})

function logout() {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #EB5E28 !important;
}

.nav-link.active {
  color: #EB5E28 !important;
  font-weight: 600;
}

.btn-logout {
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: #d64e1f !important;
  transform: translateY(-1px);
}
</style>