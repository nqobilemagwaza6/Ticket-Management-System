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
    :class="{'is-valid': passwordValid, 'is-invalid': password && !passwordValid}"
    placeholder="Enter new password"
  />
  <div class="invalid-feedback">
    Password must be at least 8 characters and include 3 of: lowercase, uppercase, number, special character.
  </div>
</div>

<div class="mb-4">
  <label class="form-label fw-semibold">Confirm Password</label>
  <input
    type="password"
    class="form-control"
    v-model="confirmPassword"
    :class="{'is-valid': passwordsMatch, 'is-invalid': confirmPassword && !passwordsMatch}"
    placeholder="Re-enter password"
  />
  <div class="invalid-feedback">
    Passwords do not match.
  </div>
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
import { ref, computed } from 'vue'
import AuthLayout from '@/components/AuthLayout.vue'
import { useRouter } from 'vue-router'
import { showSuccess, showError } from '@/utils/alerts'



const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()
const submitting = ref(false)

// Password rules
const hasMinLength = computed(() => password.value.length >= 8)
const hasLower = computed(() => /[a-z]/.test(password.value))
const hasUpper = computed(() => /[A-Z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value))

// At least 3 of the 4 rules
const passwordValid = computed(() => {
  const count = [hasLower.value, hasUpper.value, hasNumber.value, hasSpecial.value].filter(Boolean).length
  return hasMinLength.value && count >= 3
})
// Confirm password matches
const passwordsMatch = computed(() => password.value && password.value === confirmPassword.value)

async function registerUser() {
  // Frontend validation
  if (!fullName.value.trim() || 
      !email.value.trim() || 
      !password.value.trim() || 
      !confirmPassword.value.trim()) {
    await showError('Validation Error', 'All fields are required.')
    return
  }
// Check password match
  if (password.value !== confirmPassword.value) {
    await showError('Password Mismatch', 'Passwords do not match.')
    return
  }
// Set submitting state to disable button and show spinner
  submitting.value = true
// Send registration request to backend
  try {
    const response = await fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName.value.trim(),
        email: email.value.trim(),
        password: password.value
      })
    }) // Send registration request to backend
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      // Build user-friendly message
      const messages = []

      for (const key in data) {
        if (Array.isArray(data[key])) {
          messages.push(data[key].join(' '))
        } else if (typeof data[key] === 'string') {
          messages.push(data[key])
        } else if (typeof data[key] === 'object') {
          // nested object, e.g., {non_field_errors: [...]}
          messages.push(JSON.stringify(data[key]))
        }
      }
      const messageText = messages.join(' | ') 
      || 'Registration failed. Please check your inputs.'
      throw new Error(messageText)
    }
    // Success
    await showSuccess(
      'Account Created',
      'Your account has been created successfully. You can now log in.'
    )
    router.push({ name: 'Login' })
  } catch (err) {
    await showError('Registration Failed', err.message || 'Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

