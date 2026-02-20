<template>
  <div class="auth-wrapper">
    <div class="auth-card">

      <!-- Logo & System Title -->
      <div class="text-center mb-4">
        <img src="@/assets/logo.png" alt="TMS Logo" class="auth-logo mb-3" />
        <h4 class="fw-bold mb-1">Internal IT Support</h4>
        <small class="text-muted">Manage your IT tickets efficiently</small>
      </div>

      <!-- Page Content Injected Here -->
      <slot />

    </div>
  </div>
</template>
