import api from './api'
import type { Employee, EmployeeFormData } from '@/types'

export const employeeService = {
  async getAll() {
    try {
      const response = await api.get('/employees')
      
      const employeesData = response.data.data
      
      return employeesData
    } catch (error) {
      throw error
    }
  },

  async getByBranch(branchId: number) {
    try {
      const response = await api.get('/employees', { 
        params: { branch_id: branchId }
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getById(id: number) {
    const response = await api.get(`/employees/${id}`)
    return response.data.data
  },

  async create(data: EmployeeFormData) {
    try {
      const response = await api.post('/employees', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async update(id: number, data: Partial<EmployeeFormData>) {
    try {
      const response = await api.put(`/employees/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async delete(id: number) {
    try {
      const response = await api.delete(`/employees/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}