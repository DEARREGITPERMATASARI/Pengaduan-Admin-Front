import Vue from 'vue'
import store from '../store/index.js'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Petugas from '../views/Petugas.vue'
import Kategori from '../views/Kategori.vue'
import Masyarakat from '../views/Masyarakat.vue'
import Pengaduan from '../views/Pengaduan.vue'
import Navbar from '../views/layouts/Navbar.vue'
import Footer from '../views/layouts/Footer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
    {
      path: '/',
      name: 'Home',
      components: {default: Home,  header: Navbar, footer: Footer},
    },
    {
      path: '/petugas',
      name: 'Petugas',
      components: {default: Petugas, header: Navbar, footer: Footer},
     meta: {
      requiresAuth: true
    }
  },
    {
      path: '/masyarakat',
      name: 'Masyarakat',
      components: {default: Masyarakat, header: Navbar, footer: Footer},
     meta: {
      requiresAuth: true
    }
  },
    {
      path: '/pengaduan',
      name: 'Pengaduan',
      components: {default: Pengaduan, header: Navbar, footer: Footer},
     meta: {
      requiresAuth: true
    }
  },
    {
      path: '/kategori',
      name: 'Kategori',
      components: {default: Kategori, header: Navbar, footer: Footer},
     meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})  

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next() 
  }
})

export default router