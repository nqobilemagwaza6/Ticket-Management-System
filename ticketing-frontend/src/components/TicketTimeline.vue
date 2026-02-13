<template>
  <ul class="timeline">
    <li v-for="activity in activities" :key="activity.id">
      <div class="fw-semibold">{{ activity.user_name }} <span class="text-muted">({{ activity.action }})</span></div>
      <div class="text-muted small">{{ formatDate(activity.timestamp) }}</div>
      <div>{{ activity.comment }}</div>
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  activities: { type: Array, default: () => [] }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.timeline {
  list-style: none;
  padding-left: 0;
}
.timeline li {
  padding: 0.8rem 0;
  border-left: 2px solid #007bff;
  margin-left: 0.5rem;
  position: relative;
}
.timeline li::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  background-color: #007bff;
  border-radius: 50%;
}
</style>
