<template>
  <div class="col-md-3 mb-3">
    <div class="card shadow-sm p-3 text-center border-0" :class="cardClass">
      <h6 class="text-uppercase mb-2">{{ label }}</h6>
      <h3 class="fw-bold mb-0">{{ value }}</h3>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true }
})

const cardClass = computed(() => {
  switch (props.label) {
    case 'ASSIGNED TICKETS':
      return 'bg-primary text-white'
    case 'OPEN':
      return 'bg-success text-white'
    case 'IN PROGRESS':
      return 'bg-warning text-dark'
    case 'RESOLVED':
      return 'bg-secondary text-white'
    default:
      return 'bg-light'
  }
})
</script>

<style scoped>
.card {
  border-radius: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.12) !important;
}
</style>