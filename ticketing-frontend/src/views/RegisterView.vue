<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4" style="width: 400px;">
      <h3 class="text-center mb-4">Register</h3>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="success" class="alert alert-success">
        {{ success }}
      </div>

      <form @submit.prevent="registerUser">
        <div class="mb-3">
          <label class="form-label">Full Name</label>
          <input type="text" v-model="fullName" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" v-model="email" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" v-model="password" class="form-control" required />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          Register
        </button>
      </form>

      <div class="text-center mt-3">
        <router-link to="/login">Already have an account?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterView",

  data() {
    return {
      fullName: "",
      email: "",
      password: "",
      error: "",
      success: ""
    }
  },

  methods: {
    registerUser() {
      fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          full_name: this.fullName,
          email: this.email,
          password: this.password
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Registration failed")
          }
          return response.json()
        })
        .then(data => {
          console.log("Registration success:", data)
          this.success = "Account created successfully. You can now log in."
          this.error = ""
        })
        .catch(error => {
          console.error(error)
          this.error = "Registration failed. Try again."
          this.success = ""
        })
    }
  }
}
</script>
