<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4" style="width: 400px;">
      <h3 class="text-center mb-4">Login</h3>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <form @submit.prevent="loginUser">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" v-model="email" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" v-model="password" class="form-control" required />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          Login
        </button>
      </form>

      <div class="text-center mt-3">
        <router-link to="/register">Create an account</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",

  data() {
    return {
      email: "",
      password: "",
      error: ""
    }
  },

  methods: {
    loginUser() {
      fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // VERY IMPORTANT for session auth
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Invalid credentials")
          }
          return response.json()
        })
        .then(data => {
          console.log("Login success:", data)

          // Example: redirect based on role
          if (data.role === "ADMIN") {
            this.$router.push("/admin")
          } else {
            this.$router.push("/dashboard")
          }
        })
        .catch(error => {
          console.error(error)
          this.error = "Login failed. Please check your credentials."
        })
    }
  }
}
</script>
