<template>
  <div class="auth-wrapper d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="auth-card shadow-sm p-5">
      <div class="text-center mb-4">
        <img src="@/assets/logo.png" alt="TMS Logo" class="mb-2 logo">
        <h4 class="fw-bold">Forgot Password</h4>
        <p class="text-muted small">Enter your email and we'll send you a reset link.</p>
      </div>

      <div v-if="error" class="alert alert-danger py-2 text-center">{{ error }}</div>
      <div v-if="success" class="alert alert-success py-2 text-center">{{ success }}</div>

      <form @submit.prevent="onSubmit">
        <div class="mb-4">
          <label class="form-label fw-semibold">Email Address</label>
          <input 
            type="email" 
            v-model="email" 
            class="form-control" 
            placeholder="you@example.com" 
            required
          >
        </div>

        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="submitting">
          <span v-if="!submitting">Send Reset Link</span>
          <span v-else class="spinner-border spinner-border-sm"></span>
        </button>
      </form>

      <div class="text-center">
        <router-link to="/login" class="small text-decoration-none">← Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const error = ref('')
const success = ref('')
const submitting = ref(false)

async function onSubmit() {
  error.value = ''
  success.value = ''
  submitting.value = true

  try {
    const res = await fetch('http://127.0.0.1:8000/api/forgot-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value.trim() })
    })

    if (!res.ok) throw new Error('Could not find an account with that email.')

    success.value = 'If an account exists, a reset link has been sent!'
    email.value = ''
  } catch (err) {
    error.value = err.message || 'Operation failed'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.auth-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f7fb; }
.auth-card { width: 100%; max-width: 420px; background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 6px 24px rgba(15,23,36,0.08); }
.logo { width: 80px; display: block; margin: 0 auto; }
.btn-primary { font-weight: 600; background-color: #0d6efd; border: none; }
.btn-primary:hover { background-color: #0b5ed7; }
</style>