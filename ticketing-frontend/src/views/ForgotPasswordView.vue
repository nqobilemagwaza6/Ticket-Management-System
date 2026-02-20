<template>
  <div class="auth-wrapper d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="auth-card shadow-sm p-5">
      <div class="text-center mb-4">
        <img src="@/assets/logo.png" alt="TMS Logo" class="mb-2 logo">
        <h4 class="fw-bold">Forgot Password</h4>
        <p class="text-muted small">Enter your email and we'll send you a reset link.</p>
      </div>   

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
import { showInfo, showError } from '@/utils/alerts'

const email = ref('')
const submitting = ref(false)

async function onSubmit() {
  // Basic validation 
 if (!email.value.trim()) {
    await showError('Validation Error', 'Email is required.')
    return
  }
  // Set submitting state to disable button and show spinner
  submitting.value = true

  try {
    const res = await fetch('${API_BASE}/api/forgot-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value.trim() })
    })

    // Always show same message
    await showInfo(
      'Request Sent',
      'If an account exists with this email, a reset link has been sent.'
    )
       email.value = ''
  // Reset form and state 
  } catch {
   await showInfo(
      'Request Sent',
      'If an account exists with this email, a reset link has been sent.'
    )
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