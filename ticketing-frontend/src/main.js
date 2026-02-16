import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

import 'bootstrap'

// (Optional but recommended for dropdowns, modals, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import your global custom CSS
import './assets/main.css'

createApp(App).use(router).mount('#app')
