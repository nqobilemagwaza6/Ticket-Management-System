<template>
  <div class="ticket-detail-container">
    <!-- Ticket Details -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div>
            <span class="ticket-id">Ticket #{{ ticket.id }}</span>
            <h3 class="mt-2">{{ ticket.title }}</h3>
          </div>
          <span class="badge" :class="getStatusClass(ticket.status)">
            {{ ticket.status }}
          </span>
        </div>

        <div class="ticket-description mb-4">
          <p class="text-muted mb-2">Description:</p>
          <p class="description-text">{{ ticket.description }}</p>
        </div>

        <div class="ticket-meta">
          <div class="row">
            <div class="col-md-6">
              <div class="meta-item">
                <strong>Category:</strong> {{ ticket.category }}
              </div>
              <div class="meta-item">
                <strong>Priority:</strong> {{ ticket.priority }}
              </div>
            </div>
            <div class="col-md-6">
              <div class="meta-item">
                <strong>Assigned Agent:</strong> {{ ticket.assigned_to || 'Unassigned' }}
              </div>
              <div class="meta-item">
                <strong>Created:</strong> {{ formatDate(ticket.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="card">
      <div class="card-header bg-white">
        <h5 class="mb-0">Activity & Comments</h5>
      </div>
      
      <div class="card-body">
        <!-- Comments List -->
        <div class="comments-list mb-4">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="d-flex justify-content-between align-items-start">
              <div class="comment-author">
                <strong>{{ comment.user_email || 'user@example.com' }}</strong>
              </div>
              <div class="comment-date text-muted small">
                {{ formatDate(comment.created_at) }}
              </div>
            </div>
            <p class="comment-text mt-2">{{ comment.text }}</p>
          </div>
          
          <!-- Sample comments for demo -->
          <div class="comment-item">
            <div class="d-flex justify-content-between align-items-start">
              <div class="comment-author">
                <strong>admin@example.com</strong>
              </div>
              <div class="comment-date text-muted small">
                5/17/2023
              </div>
            </div>
            <p class="comment-text mt-2">Comment 1 for Ticket 1</p>
          </div>
          
          <div class="comment-item">
            <div class="d-flex justify-content-between align-items-start">
              <div class="comment-author">
                <strong>user1@example.com</strong>
              </div>
              <div class="comment-date text-muted small">
                5/17/2023
              </div>
            </div>
            <p class="comment-text mt-2">Comment 2 for Ticket 1</p>
          </div>
        </div>

        <!-- Add Comment Form -->
        <div class="add-comment">
          <textarea 
            class="form-control mb-3" 
            rows="3" 
            placeholder="Add a comment..."
            v-model="newComment"
          ></textarea>
          <button class="btn btn-primary" @click="submitComment">
            Add comment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const ticket = ref({})
const comments = ref([])
const newComment = ref('')

function getStatusClass(status) {
  switch(status) {
    case 'Open':
      return 'badge-open'
    case 'In Progress':
      return 'badge-progress'
    case 'Resolved':
      return 'badge-resolved'
    default:
      return 'badge-open'
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

function submitComment() {
  if (!newComment.value.trim()) return
  // Add comment logic here
  alert('Comment added (demo)')
  newComment.value = ''
}

async function fetchTicket() {
  try {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    
    // If the token doesn't exist, exit the function
    if (!token) {
      console.error("No token found");
      return;
    }

    const res = await fetch(`http://127.0.0.1:8000/api/tickets/${route.params.id}/`, {
      method: 'GET', // Use GET method to fetch ticket details
      credentials: 'include', // This includes cookies (session info)
      headers: {
        'Authorization': `Token ${token}`, // Include the token in the Authorization header
        'Content-Type': 'application/json' // Ensure content type is JSON
      }
    });

    if (!res.ok) throw new Error('Failed to fetch ticket'); // Error if response is not OK

    ticket.value = await res.json(); // Parse the response JSON and set it to the ticket data

  } catch (err) {
    console.error(err); // Log the error in case of failure
  }
}


onMounted(fetchTicket)
</script>

<style scoped>
.ticket-detail-container {
  max-width: 900px;
  margin: 0 auto;
}

.ticket-id {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.badge-open {
  background-color: #FEF3C7;
  color: #92400E;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.badge-progress {
  background-color: #E0F2FE;
  color: #0369A1;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.badge-resolved {
  background-color: #DCFCE7;
  color: #166534;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.description-text {
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  color: #374151;
}

.meta-item {
  margin-bottom: 12px;
  color: #4b5563;
}

.meta-item strong {
  color: #374151;
  min-width: 120px;
  display: inline-block;
}

.comments-list {
  max-height: 500px;
  overflow-y: auto;
}

.comment-item {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-author {
  color: #374151;
  font-size: 14px;
}

.comment-text {
  color: #4b5563;
  margin-bottom: 0;
  line-height: 1.6;
}

.add-comment textarea {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  resize: vertical;
}

.add-comment textarea:focus {
  border-color: #EB5E28;
  box-shadow: 0 0 0 3px rgba(235, 94, 40, 0.1);
}

.btn-primary {
  background-color: #EB5E28;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #d04f1f;
}
</style>