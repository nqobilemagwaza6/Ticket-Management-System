<template>
  <div class="auth-wrapper d-flex justify-content-center align-items-center min-vh-100">
    <div class="auth-card shadow-sm text-center">
      <div class="success-icon mb-4">
        <i class="bi bi-check2-circle display-1 text-success"></i>
      </div>
      <h3 class="fw-bold mb-2">Password Changed!</h3>
      <p class="text-muted mb-4">Your password has been changed successfully.</p>
      
      <router-link to="/login" class="btn btn-primary w-100 py-2 fw-bold">
        Back to Login
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* Reuse the same CSS from Login View */
.success-icon i { color: #41b883 !important; }
</style>