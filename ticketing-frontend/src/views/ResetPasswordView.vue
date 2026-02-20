<template>
  <div class="auth-wrapper d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-card shadow-sm">
      <h4 class="fw-bold text-center mb-2">Change Your Password</h4>
      <p class="text-muted text-center small mb-4">
        Enter a new password below to change your password.
      </p>


      <form @submit.prevent="handleReset">
        <!-- New Password -->
        <div class="mb-3 position-relative">
          <label class="form-label small fw-bold">New password</label>
          <input
            type="password"
            class="form-control"
            v-model="newPassword"
            required
          />
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label class="form-label small fw-bold">Re-enter new password</label>
          <input
            type="password"
            class="form-control border-primary"
            v-model="confirmPassword"
            required
          />
        </div>

        <!-- Password Requirements -->
        <div class="requirements-box p-3 mb-4 rounded border">
          <p class="small fw-bold mb-2">Your password must contain:</p>
          <ul class="list-unstyled mb-0">
            <li :class="['small', hasMinLength ? 'text-success' : 'text-muted']">
              <i :class="hasMinLength ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
              At least 8 characters
            </li>
            <li :class="['small', hasRequirements ? 'text-success' : 'text-muted']">
              <i :class="hasRequirements ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
              At least 3 of the following:
              <ul class="ms-3 list-unstyled">
                <li :class="hasLower ? 'text-success' : 'text-muted'">• Lower case letters (a-z)</li>
                <li :class="hasUpper ? 'text-success' : 'text-muted'">• Upper case letters (A-Z)</li>
                <li :class="hasNumber ? 'text-success' : 'text-muted'">• Numbers (0-9)</li>
                <li :class="hasSpecial ? 'text-success' : 'text-muted'">• Special characters (!@#$...)</li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- Save Button -->
        <button
          type="submit"
          class="btn btn-primary w-100 py-2 fw-bold"
          :disabled="!isFormValid || submitting"
        >
          <span v-if="!submitting">SAVE</span>
          <span v-else class="spinner-border spinner-border-sm"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showSuccess, showError } from '@/utils/alerts'

const router = useRouter()
const route = useRoute()
const API_BASE = 'https://ticket-management-system-aw70.onrender.com'



// Form state
const newPassword = ref('')
const confirmPassword = ref('')
const submitting = ref(false)

// Route params
const { uid, token } = route.params

// Password validation
const hasMinLength = computed(() => newPassword.value.length >= 8)
const hasLower = computed(() => /[a-z]/.test(newPassword.value))
const hasUpper = computed(() => /[A-Z]/.test(newPassword.value))
const hasNumber = computed(() => /[0-9]/.test(newPassword.value))
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(newPassword.value))
const hasRequirements = computed(() => {
  const count = [hasLower.value, hasUpper.value, hasNumber.value, hasSpecial.value].filter(Boolean).length
  return count >= 3
})
// Form validity
const isFormValid = computed(() => hasMinLength.value && 
hasRequirements.value && 
newPassword.value === confirmPassword.value)

// Handle password reset
const handleReset = async () => {
 if (!isFormValid.value) {
    await showError(
      'Invalid Password',
      'Please meet all password requirements and ensure both fields match.'
    )
    return
  }
  // Set submitting state to disable button and show spinner
submitting.value = true
  try {
    const response = await fetch('${API_BASE}/api/reset-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, token, new_password: newPassword.value })
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.detail || 'Invalid or expired reset link.')
    }
     await showSuccess(
      'Password Reset Successful',
      'Your password has been updated. You can now log in.'
    )
    // Redirect to login page with success message
    router.push({ name: 'Login'  })
  } 
  catch (err) {
    await showError(
      'Reset Failed',
      err.message || 'Something went wrong.'
    )
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.requirements-box {
  background-color: #fafafa;
  font-size: 0.85rem;
}
.text-success {
  color: #28a745 !important;
  font-weight: bold;
}
</style>
