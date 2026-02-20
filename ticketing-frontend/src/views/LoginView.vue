<template>
  <AuthLayout>

    <h5 class="fw-bold text-center mb-3">Login</h5>

    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <form @submit.prevent="loginUser">

      <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div class="mb-2">
        <label class="form-label fw-semibold">Password</label>
        <input
          type="password"
          class="form-control"
          v-model="password"
          placeholder="••••••••"
          required
        />
      </div>

      <div class="text-end mb-3">
        <router-link to="/forgot-password" class="small text-decoration-none small">
          Forgot password?
        </router-link>
      </div>

     <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="submitting">
  <span v-if="!submitting">Login</span>
  <span v-else class="spinner-border spinner-border-sm"></span>
</button>


    </form>

    <div class="text-center mt-4">
      <small class="text-muted">
        Don’t have an account?
        <router-link to="/register" class="fw-bold text-decoration-none">
          Register
        </router-link>
      </small>
    </div>

  </AuthLayout>
</template>

<script setup>
// Importing  necessary modules and components
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/components/AuthLayout.vue'
import { showSuccess, showError } from '@/utils/alerts'

// Reactive state variables
const router = useRouter() 
const email = ref('')
const password = ref('')
const submitting = ref(false)
const API_BASE = 'https://ticket-management-system-aw70.onrender.com'


async function loginUser() {
   // Frontend validation
  if (!email.value.trim() || !password.value.trim()) {
    await showError('Validation Error', 'Email and password are required.')
    return
  } 
  // Set submitting state to disable button and show spinner
  submitting.value = true

  try {// Send login request to backend
    const response = await fetch('${API_BASE}/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value
      })
    })
// Check for HTTP errors
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || 'Invalid email or password.')
    }
// Parse response data
    const data = await response.json()
    if (!data.user) {
    throw new Error(data.message || 'Invalid email or password.')
  }
// Store user info and authentication status
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('isAuthenticated', 'true')
// Show success alert
    await showSuccess('Login Successful', 'Welcome back!')

    // Redirect based on role using route names
    if (data.user.role === 'admin') {
      router.push({ name: 'AdminDashboard' })         // Admin dashboard
    } else if (data.user.role === 'support') {
      router.push({ name: 'SupportDashboard' })      // Support agent dashboard
    } else {
      router.push({ name: 'EmployeeDashboard' })     // Regular user dashboard
    }
// Handle errors
  } catch (err) { // Show error alert with specific message
    await showError('Authentication Failed', err.message || 'Login failed.')
  } finally { // Ensure submitting state is reset
    submitting.value = false
  }
}

</script>


