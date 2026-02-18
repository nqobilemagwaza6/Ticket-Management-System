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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/components/AuthLayout.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function loginUser() {
  error.value = ''
  submitting.value = true

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: email.value.trim(), password: password.value })
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || 'Invalid email or password.')
    }

    const data = await response.json()
    if (!data.user) throw new Error(data.message || 'Invalid email or password.')

    // Saves user info for UI purposes only
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('isAuthenticated', 'true')

    // Redirect based on role using route names
    if (data.user.role === 'admin') {
      router.push({ name: 'AdminDashboard' })         // Admin dashboard
    } else if (data.user.role === 'support') {
      router.push({ name: 'SupportDashboard' })      // Support agent dashboard
    } else {
      router.push({ name: 'EmployeeDashboard' })     // Regular user dashboard
    }

  } catch (err) {
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    submitting.value = false
  }
}

</script>


