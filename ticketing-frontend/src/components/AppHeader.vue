<template>
  <header class="app-header d-flex justify-content-between align-items-center px-3">
 
    <!-- Hamburger (mobile) -->
    <button class="btn d-lg-none" @click="$emit('toggleSidebar')">
      <i class="bi bi-list fs-4"></i>
    </button>
 
    <!-- Welcome Text -->
    <h6 class="mb-0 fw-semibold header-welcome">
      <span class="d-none d-sm-inline">Welcome {{ userNameDisplay }}</span>
      <span class="d-inline d-sm-none">{{ userShort }}</span>
    </h6>
 
    <!-- Logout Icon -->
    <button class="btn btn-sm" @click="logout">
      <i class="bi bi-box-arrow-right fs-5"></i>
    </button>
 
  </header>
</template>
 
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
 
const router = useRouter()
const userName = ref('User')
const userNameDisplay = ref('User')
const userShort = ref('User')

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  // Prefer explicit admin greeting
  if (user.role === 'admin') {
    userName.value = 'Admin'
    userNameDisplay.value = 'Admin'
    userShort.value = 'Admin'
  } else {
    userName.value = user.full_name || 'User'
    userNameDisplay.value = user.full_name || 'User'
    // short form: first name or fallback
    userShort.value = (user.full_name || 'User').split(' ')[0]
  }
})
 
function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('isAuthenticated')
  router.push({ name: 'Login' })
}
</script>
 
<style scoped>
.app-header {
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}
</style>
