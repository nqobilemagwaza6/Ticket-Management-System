<template>
  <div class="container mt-4">
    <UserNavbar />
    <h2>Create New Ticket</h2>

    <form @submit.prevent="submitTicket">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input type="text" v-model="title" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Category</label>
        <select v-model="category" class="form-select" required>
          <option value="" disabled>Select Category</option>
          <option>Hardware</option>
          <option>Software</option>
          <option>Network</option>
          <option>Other</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea v-model="description" class="form-control" required minlength="30"></textarea>
        <small class="form-text text-muted">
          Describe what you were trying to do, what happened instead, and when it started.
        </small>
      </div>

      <div class="mb-3">
        <label class="form-label">Attachment (optional)</label>
        <input type="file" @change="handleFileUpload" class="form-control" />
      </div>

      <button type="submit" class="btn btn-primary me-2">Submit</button>
      <router-link to="/employee-dashboard" class="btn btn-secondary">Cancel</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserNavbar from './components/UserNavbar.vue'

const title = ref('')
const category = ref('')
const description = ref('')
const attachment = ref(null)

function handleFileUpload(event) {
  attachment.value = event.target.files[0]
}

async function submitTicket() {
  if (description.value.length < 30) {
    alert('Description must be at least 30 characters.')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('category', category.value)
  formData.append('description', description.value)
  if (attachment.value) formData.append('attachment', attachment.value)

  try {
    const res = await fetch('http://127.0.0.1:8000/api/tickets/', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    if (!res.ok) throw new Error('Failed to create ticket')
    alert('Ticket created successfully')
    // Redirect to dashboard
    window.location.href = '/employee-dashboard'
  } catch (err) {
    console.error(err)
    alert('Failed to create ticket.')
  }
}
</script>
