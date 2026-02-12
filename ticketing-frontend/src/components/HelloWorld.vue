<template>
  <div>
    <button @click="fetchMessage">Sign in to Backend</button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''  // will hold backend response
    }
  },
  methods: {
    fetchMessage() {
      fetch('http://127.0.0.1:8000/api/hello/')
        .then(response => response.json())
        .then(data => {
          this.message = data.message
        })
        .catch(error => {
          console.error(error)
          this.message = 'Cannot connecting to backend'
        })
    }
  }
}
</script>

<style scoped>
button {
  background-color: #3490dc;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #2779bd;
}
</style>
