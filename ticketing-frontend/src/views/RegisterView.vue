<template>
  <AuthLayout>

    <h5 class="fw-bold text-center mb-3">Create Account</h5>

    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-if="success" class="alert alert-success text-center">
      {{ success }}
    </div>

    <form @submit.prevent="registerUser">

      <div class="mb-3">
        <label class="form-label fw-semibold">Full Name</label>
        <input
          type="text"
          class="form-control"
          v-model="fullName"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="email"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Password</label>
        <input
          type="password"
          class="form-control"
          v-model="password"
          required
        />
      </div>

      <div class="mb-4">
        <label class="form-label fw-semibold">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          v-model="confirmPassword"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary w-100 fw-bold">
        Register
      </button>

    </form>

    <div class="text-center mt-4">
      <small class="text-muted">
        Already have an account?
        <router-link to="/login" class="fw-bold text-decoration-none">
          Login
        </router-link>
      </small>
    </div>

  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import AuthLayout from '@/components/AuthLayout.vue'

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

function registerUser() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  fetch('http://127.0.0.1:8000/api/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: fullName.value,
      email: email.value,
      password: password.value
    })
  })
    .then(res => {
      if (!res.ok) throw new Error()
      return res.json()
    })
    .then(() => {
      success.value = 'Account created successfully. You can now log in.'
      error.value = ''
    })
    .catch(() => {
      error.value = 'Registration failed. Please try again.'
      success.value = ''
    })
}
</script>
