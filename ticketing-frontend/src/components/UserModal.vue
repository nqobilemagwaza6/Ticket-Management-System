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
          <button type="button" class="btn btn-secondary me-2" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn btn-success">{{ isEdit ? 'Save' : 'Add' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  user: { type: Object, default:null },
  isEdit: { type: Boolean, default:false }
})
const emit = defineEmits(['close','save'])

// Local copy
const localUser = reactive({
  name:'',
  email:'',
  password:'',
  role:'User'
})

// Watch prop changes for edit
watch(() => props.user, (newVal) => {
  if(newVal) Object.assign(localUser, newVal)
}, { immediate:true })

const handleSave = () => {
  emit('save', {...localUser})
  if(!props.isEdit){
    localUser.name=''
    localUser.email=''
    localUser.password=''
    localUser.role='User'
  }
}
</script>

<style scoped>
.modal-backdrop {
  position:fixed; top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5);
  display:flex; justify-content:center; align-items:center;
  z-index:1000;
}
.modal-container {
  background:#fff;
  padding:1.5rem;
  border-radius:12px;
  width:400px;
}
</style>
