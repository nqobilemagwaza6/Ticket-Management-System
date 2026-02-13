<template>
  <AuthLayout>

    <h5 class="fw-bold text-center mb-3">Forgot Password</h5>

    <p class="text-muted text-center small mb-4">
      Enter your email and we'll send you a reset link.
    </p>

    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-if="success" class="alert alert-success text-center">
      {{ success }}
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
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="submitting"
      >
        <span v-if="!submitting">Send Reset Link</span>
        <span v-else class="spinner-border spinner-border-sm"></span>
      </button>

    </form>

    <div class="text-center mt-3">
      <router-link to="/login" class="small text-decoration-none">
        ← Back to Login
      </router-link>
    </div>

  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import AuthLayout from '@/components/AuthLayout.vue'

const email = ref('')
const error = ref('')
const success = ref('')
const submitting = ref(false)

async function onSubmit() {
  error.value = ''
  success.value = ''
  submitting.value = true

  try {
    await fetch('http://127.0.0.1:8000/api/forgot-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value.trim() })
    })

    success.value =
      'If an account with this email exists, a reset link has been sent.'

    email.value = ''
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
