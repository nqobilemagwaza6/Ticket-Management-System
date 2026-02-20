<template>
  <div class="create-ticket-container">
    <div class="card">
      <div class="card-header bg-white">
        <h5 class="mb-0">Create New Ticket</h5>
      </div>
      
      <div class="card-body">
        <form @submit.prevent="submitTicket">
          <!-- Title -->
          <div class="mb-4">
            <label class="form-label">Title</label>
            <input 
              type="text" 
              v-model="title" 
              class="form-control" 
              required 
              placeholder="Brief description of the issue"
            />
          </div>

          <!-- Category -->
          <div class="mb-4">
            <label class="form-label">Category</label>
            <select v-model="category" class="form-select" required>
              <option value="" disabled>Select Category</option>
              <option>Hardware</option>
              <option>Software</option>
              <option>Network</option>
              <option>Other</option>
            </select>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label class="form-label">Description</label>
            <textarea
              v-model="description"
              class="form-control"
              rows="5"
              required
              placeholder="Describe what you were trying to do, what happened instead, and when it started."
            ></textarea>
          </div>

          <!-- Attachment -->
          <div class="mb-4">
            <label class="form-label">Attachment (optional)</label>
            <div class="file-upload">
              <input 
                type="file" 
                @change="handleFileUpload" 
                id="fileInput"
              />
              <label for="fileInput" class="file-upload-label">
                Choose File
              </label>
              <span class="file-name ms-2">{{ fileName || 'No file chosen' }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              Submit
            </button>
            <button 
              type="button" 
              class="btn btn-secondary"
              @click="router.push('/employee-dashboard')"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const title = ref('')
const category = ref('')
const description = ref('')
const attachment = ref(null)
const fileName = ref('')
const API_BASE = 'https://ticketing-backend-1-mylx.onrender.com'


function handleFileUpload(event) {
  const file = event.target.files[0]
  attachment.value = file
  fileName.value = file ? file.name : ''
}

async function submitTicket() {
  try {
    // Prepare the form data to send in the POST request
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('category', category.value);
    formData.append('description', description.value);
    if (attachment.value) formData.append('attachment', attachment.value);
    const token = localStorage.getItem('token');
    // Send POST request to create a new ticket
    const res = await fetch('${API_BASE}/api/create_ticket/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}` // Use the token for authentication
      },
      body: formData
    });

    // Handle response
    if (res.ok) {
      const data = await res.json();
      await Swal.fire({
        icon: 'success',
        title: 'Ticket Created',
        text: 'Your ticket has been successfully created!',
        confirmButtonColor: '#3085d6'
      })
      router.push({ name: 'EmployeeDashboard' }); // Redirect to the dashboard
    } else {
      const data = await res.json();
      console.error(data);
      alert('Failed to create ticket. Please try again.');
    }

  } catch (err) {
    console.error(err);
    alert('An error occurred while creating the ticket.');
  }
}

</script>

<style scoped>
.create-ticket-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-label {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
}

.form-control, .form-select {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
}

.form-control:focus, .form-select:focus {
  border-color: #EB5E28;
  box-shadow: 0 0 0 3px rgba(235, 94, 40, 0.1);
}

textarea.form-control {
  resize: vertical;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-upload input[type="file"] {
  display: none;
}

.file-upload-label {
  background-color: #f3f4f6;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.file-upload-label:hover {
  background-color: #e5e7eb;
}

.file-name {
  color: #6b7280;
  font-size: 14px;
}

.btn-primary {
  background-color: #EB5E28;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #d04f1f;
}

.btn-secondary {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 500;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style>