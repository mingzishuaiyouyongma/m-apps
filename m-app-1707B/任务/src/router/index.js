import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Index from '../views/Index'
import Home from '../views/Home'
import MyBook from '../views/MyBook'
import News from '../views/News'
import Task from '../views/Task'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/index',
    component: Index,
    children: [{
      path: '/index/home',
      component: Home
    }, {
      path: '/index/my_book',
      component: MyBook,
      meta: {
        needLogin: true
      }
    }, {
      path: '/index/news',
      component: News
    }, {
      path: '/index/task',
      component: Task
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.needLogin) {
    if (localStorage.getItem('username')) {
      next()
    } else {
      next('/login')
    }
  }
  next()
})

export default router
