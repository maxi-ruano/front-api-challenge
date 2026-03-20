import { createRouter, createWebHistory } from 'vue-router'
import BranchesView from '../views/BranchesView.vue'
import EmployeesView from '../views/EmployeesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'branches',
      component: BranchesView
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesView
    }
  ]
})

export default router