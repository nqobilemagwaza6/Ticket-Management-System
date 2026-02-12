 

<template>
	<div class="dashboard-root">
		<aside class="sidebar">
			<div class="brand">TMS</div>
			<nav>
				<a class="nav-item active">Dashboard</a>
				<a class="nav-item">Tickets</a>
				<a class="nav-item">Knowledge</a>
				<a class="nav-item">Settings</a>
			</nav>
		</aside>

		<div class="main-area">
			<header class="topbar">
				<div class="topbar-left">Register</div>
				<div class="topbar-right">Already a member? <router-link to="/login">Sign in</router-link></div>
			</header>

			<main class="content">
				<div class="card-wrap">
					<form class="card" @submit.prevent="onSubmit">
						<h2>Create account</h2>

						<div class="form-group">
							<label for="name">Full name</label>
							<input id="name" v-model="form.name" type="text" placeholder="Jane Doe" />
							<small v-if="errors.name" class="error">{{ errors.name }}</small>
						</div>

						<div class="form-group">
							<label for="email">Email</label>
							<input id="email" v-model="form.email" type="email" placeholder="you@company.com" />
							<small v-if="errors.email" class="error">{{ errors.email }}</small>
						</div>

						<div class="two-col">
							<div class="form-group">
								<label for="password">Password</label>
								<input id="password" v-model="form.password" type="password" placeholder="••••••••" />
								<small v-if="errors.password" class="error">{{ errors.password }}</small>
							</div>

							<div class="form-group">
								<label for="confirm">Confirm Password</label>
								<input id="confirm" v-model="form.confirm" type="password" placeholder="••••••••" />
								<small v-if="errors.confirm" class="error">{{ errors.confirm }}</small>
							</div>
						</div>

						<button class="primary" :disabled="submitting">Register</button>

						<p class="muted">Role: <strong>User</strong> — assigned by system (not visible to public)</p>

						<p v-if="message" :class="{'success': messageType==='success', 'error': messageType==='error'}" class="submit-message">{{ message }}</p>
					</form>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({ name: '', email: '', password: '', confirm: '' })
const errors = reactive({ name: '', email: '', password: '', confirm: '' })
const submitting = ref(false)
const message = ref('')
const messageType = ref('')

function validate() {
	errors.name = form.name.trim() ? '' : 'Full name is required.'
	const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
	errors.email = emailRe.test(form.email) ? '' : 'Enter a valid email.'
	errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
	errors.confirm = form.confirm === form.password ? '' : 'Passwords do not match.'

	return !errors.name && !errors.email && !errors.password && !errors.confirm
}

async function onSubmit() {
	message.value = ''
	messageType.value = ''
	if (!validate()) return

	submitting.value = true

	// Prepare payload — role intentionally omitted from UI and will be set server-side or here as "User" by default
	const payload = {
		name: form.name.trim(),
		email: form.email.trim(),
		password: form.password,
		role: 'User'
	}

	try {
		// Placeholder API endpoint — adapt to your backend
		const res = await fetch('/api/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})

		if (!res.ok) {
			const err = await res.json().catch(() => ({}))
			throw new Error(err.message || 'Registration failed')
		}

		messageType.value = 'success'
		message.value = 'Account created — redirecting to login...'
		setTimeout(() => router.push('/login'), 1200)
	} catch (err) {
		messageType.value = 'error'
		message.value = err.message || 'Failed to register.'
	} finally {
		submitting.value = false
	}
}
</script>

<style scoped>
/* Layout */
.dashboard-root{display:flex;min-height:100vh;background:#f5f7fb;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
.sidebar{width:220px;background:#0f1724;color:#fff;padding:28px 18px;display:flex;flex-direction:column}
.brand{font-weight:700;font-size:20px;margin-bottom:18px}
.nav-item{display:block;color:rgba(255,255,255,0.75);padding:10px 8px;border-radius:8px;margin-bottom:6px;text-decoration:none}
.nav-item.active{background:linear-gradient(90deg,#1f6feb,#a16eff);color:#fff}

.main-area{flex:1;display:flex;flex-direction:column}
.topbar{height:64px;background:transparent;display:flex;align-items:center;justify-content:space-between;padding:0 28px;border-bottom:1px solid rgba(15,23,36,0.06)}
.topbar-left{font-weight:600;color:#0f1724}
.topbar-right{color:#475569}

.content{flex:1;display:flex;align-items:center;justify-content:center;padding:40px}
.card-wrap{width:100%;max-width:540px}

.card{background:#fff;padding:28px;border-radius:12px;box-shadow:0 6px 24px rgba(15,23,36,0.08);display:flex;flex-direction:column;gap:12px}
.card h2{margin:0 0 6px 0}
.form-group{display:flex;flex-direction:column}
.form-group label{font-size:13px;color:#334155;margin-bottom:6px}
.form-group input{padding:10px 12px;border:1px solid #e6edf3;border-radius:8px;font-size:14px}
.two-col{display:flex;gap:12px}
.two-col .form-group{flex:1}
.primary{margin-top:10px;padding:10px 12px;border-radius:8px;border:0;background:linear-gradient(90deg,#1f6feb,#7c5cff);color:#fff;font-weight:600;cursor:pointer}
.primary:disabled{opacity:0.6;cursor:default}
.muted{font-size:12px;color:#64748b;margin-top:8px}
.error{color:#ef4444;font-size:12px;margin-top:6px}
.submit-message{margin-top:8px;font-size:13px}
.success{color:#059669}

@media (max-width:800px){
	.sidebar{display:none}
	.card-wrap{padding:0 18px}
	.two-col{flex-direction:column}
}
</style>

