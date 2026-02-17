<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content p-3">
        <h5>{{ isAssign ? 'Assign' : 'Categorize' }} Ticket</h5>
        <div v-if="isAssign" class="mb-2">
          <label>Assign Agent</label>
          <input type="text" v-model="localTicket.agent" class="form-control" placeholder="Agent Name"/>
        </div>
        <div v-else class="mb-2">
          <label>Category</label>
          <select v-model="localTicket.category" class="form-select">
            <option value="">Uncategorized</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Account Access">Account Access</option>
          </select>
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="$emit('close')">Cancel</button>
          <button class="btn btn-primary" @click="saveTicket">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  ticket: Object,
  isAssign: Boolean
})

const emit = defineEmits(['close', 'save'])

const localTicket = reactive({ ...props.ticket })

const saveTicket = () => {
  emit('save', localTicket)
}
</script>

<style>
.modal {
  background: rgba(0,0,0,0.5);
}
</style>
