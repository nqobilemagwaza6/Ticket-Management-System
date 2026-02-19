<template>
  <div class="col-md-3 mb-3">
  <div class="card stat-shadow shadow-sm p-3 text-center border-4">
      <h6 >{{ label }}</h6>
      <h3> {{ value }}</h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true }
})
</script>

<style scoped>
.card {
  border-radius: 1rem;
  background-color: #ffffff; /* white card */
  color: #000000; /* black text */
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

/* Orange accent shadow */
.stat-shadow {
  box-shadow: 0 6px 15px rgba(235, 94, 40, 0.35);
}

/* Hover effect */
.stat-shadow:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(235, 94, 40, 0.55);
}

/* Label text */
.stat-shadow h6 {
  font-size: 0.85rem;
  letter-spacing: 0.7px;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

/* Number */
.stat-shadow h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}
</style>