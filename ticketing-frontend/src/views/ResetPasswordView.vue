<template>
  <div class="auth-wrapper d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-card shadow-sm">
      <h4 class="fw-bold text-center mb-2">Change Your Password</h4>
      <p class="text-muted text-center small mb-4">Enter a new password below to change your password.</p>

      <form @submit.prevent="handleReset">
        <div class="mb-3 position-relative">
          <label class="form-label small fw-bold">New password</label>
          <input type="password" class="form-control" v-model="newPassword" required />
        </div>

        <div class="mb-4">
          <label class="form-label small fw-bold">Re-enter new password</label>
          <input type="password" class="form-control border-primary" v-model="confirmPassword" required />
        </div>

        <div class="requirements-box p-3 mb-4 rounded border">
          <p class="small fw-bold mb-2">Your password must contain:</p>
          <ul class="list-unstyled mb-0">
            <li :class="['small', hasMinLength ? 'text-success' : 'text-muted']">
              <i :class="hasMinLength ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i> At least 8 characters
            </li>
            <li :class="['small', hasRequirements ? 'text-success' : 'text-muted']">
              <i :class="hasRequirements ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i> At least 3 of the following:
              <ul class="ms-3 list-unstyled">
                <li :class="hasLower ? 'text-success' : 'text-muted'">• Lower case letters (a-z)</li>
                <li :class="hasUpper ? 'text-success' : 'text-muted'">• Upper case letters (A-Z)</li>
                <li :class="hasNumber ? 'text-success' : 'text-muted'">• Numbers (0-9)</li>
                <li :class="hasSpecial ? 'text-success' : 'text-muted'">• Special characters (!@#$...)</li>
              </ul>
            </li>
          </ul>
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 fw-bold" :disabled="!isFormValid">SAVE</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const newPassword = ref('');
const confirmPassword = ref('');

const hasMinLength = computed(() => newPassword.value.length >= 8);
const hasLower = computed(() => /[a-z]/.test(newPassword.value));
const hasUpper = computed(() => /[A-Z]/.test(newPassword.value));
const hasNumber = computed(() => /[0-9]/.test(newPassword.value));
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(newPassword.value));

const hasRequirements = computed(() => {
  const met = [hasLower.value, hasUpper.value, hasNumber.value, hasSpecial.value].filter(Boolean).length;
  return met >= 3;
});

const isFormValid = computed(() => {
  return hasMinLength.value && hasRequirements.value && newPassword.value === confirmPassword.value;
});

const handleReset = () => { /* Logic to call your API */ };
</script>

<style scoped>
/* Reuse the same CSS from Login View for consistency */
.requirements-box { background-color: #fafafa; font-size: 0.85rem; }
.text-success { color: #28a745 !important; font-weight: bold; }
</style>