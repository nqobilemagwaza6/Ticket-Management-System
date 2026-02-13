<template>
  <div class="auth-wrapper d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="auth-card shadow-sm p-5">

      <!-- Logo & Title -->
      <div class="text-center mb-4">
        <img src="@/assets/logo.png" alt="TMS Logo" class="mb-2 logo">
        <h4 class="fw-bold">Internal IT Support</h4>
        <small class="text-muted">Manage your IT tickets efficiently</small>
      </div>

      <!-- Alerts -->
      <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
      <div v-if="success" class="alert alert-success py-2">{{ success }}</div>

      <!-- Form -->
      <form @submit.prevent="onSubmit">
        <!-- Name field only on Register -->
        <div v-if="isRegister" class="mb-3">
          <label class="form-label">Full Name</label>
          <input type="text" v-model="form.name" class="form-control" placeholder="Jane Doe" required>
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" v-model="form.email" class="form-control" placeholder="you@example.com" required>
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" v-model="form.password" class="form-control" placeholder="••••••••" required>
        </div>

        <div v-if="isRegister" class="mb-3">
          <label class="form-label">Confirm Password</label>
          <input type="password" v-model="form.confirm" class="form-control" placeholder="••••••••" required>
        </div>

        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="submitting">
          {{ isRegister ? "Register" : "Login" }}
        </button>
      </form>

      <!-- Links -->
      <div class="d-flex justify-content-between">
        <router-link v-if="!isRegister" to="/forgot-password" class="small">Forgot password?</router-link>
        <router-link :to="isRegister ? '/login' : '/register'" class="small">
          {{ isRegister ? "Already have an account? Login" : "Don't have an account? Register" }}
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isRegister = computed(() => route.path.includes('register'))

const form = reactive({ name: '', email: '', password: '', confirm: '' })
const error = ref('')
const success = ref('')
const submitting = ref(false)

function validate() {
  error.value = ''
  if (isRegister.value) {
    if (!form.name.trim()) { error.value = 'Full name is required.'; return false }
    if (form.password !== form.confirm) { error.value = 'Passwords do not match.'; return false }
  }
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  if (!emailRe.test(form.email)) { error.value = 'Enter a valid email.'; return false }
  if (form.password.length < 8) { error.value = 'Password must be at least 8 characters.'; return false }
  return true
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  error.value = ''
  success.value = ''

  const payload = { email: form.email.trim(), password: form.password }
  if (isRegister.value) {
    payload.name = form.name.trim()
    payload.role = 'User'
  }

  const endpoint = isRegister.value ? '/api/register/' : '/api/login/'

  try {
    const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Request failed')
    }
    success.value = isRegister.value ? 'Account created! Redirecting...' : 'Login successful! Redirecting...'
    setTimeout(() => router.push(isRegister.value ? '/login' : '/dashboard'), 1200)
  } catch (err) {
    error.value = err.message || 'Operation failed'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fb;
  font-family: Inter, Roboto, Helvetica, Arial, sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 6px 24px rgba(15,23,36,0.08);
}

.logo {
  width: 80px;
  display: block;
  margin: 0 auto;
}

.btn-primary {
  font-weight: 600;
}

.alert {
  font-size: 13px;
  padding: 6px 10px;
}

@media (max-width: 768px) {
  .auth-card {
    padding: 30px 20px;
  }
}
</style>
