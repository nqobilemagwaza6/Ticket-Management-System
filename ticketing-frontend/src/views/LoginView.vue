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
        <router-link to="/forgot-password" class="small text-decoration-none">
          Forgot password?
        </router-link>
      </div>

      <button type="submit" class="btn btn-primary w-100 fw-bold">
        Login
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
import AuthLayout from '@/components/AuthLayout.vue'

const email = ref('')
const password = ref('')
const error = ref('')

function loginUser() {
  // Your existing login logic here
}
</script>
