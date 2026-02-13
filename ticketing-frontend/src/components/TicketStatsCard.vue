<template>
  <div class="col-md-4 mb-3">
    <div class="card shadow-sm p-3 text-center">
      <h6 class="text-uppercase">{{ label }}</h6>
      <h3 class="fw-bold">{{ value }}</h3>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true }
})
</script>

<style scoped>
.card {
  border-radius: 0.8rem;
}
</style>
