import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee, EmployeeFormData } from '@/types'
import { employeeService } from '@/services/employeeService'

export const useEmployeeStore = defineStore('employees', () => {
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedBranchId = ref<number | null>(null)

  const filteredByBranch = computed(() => {
    if (!selectedBranchId.value) return employees.value
    
    return employees.value.filter(emp => emp.branch_id === selectedBranchId.value)
  })

  const hasEmployees = computed(() => employees.value.length > 0)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  async function fetchEmployees(branchId?: number) {
    loading.value = true
    error.value = null
    
    try {
      let data: Employee[]
      
      if (branchId) {
        data = await employeeService.getByBranch(branchId)
        selectedBranchId.value = branchId
      } else {
        data = await employeeService.getAll()
      }
      
      employees.value = data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error loading employees'
    } finally {
      loading.value = false
    }
  }

  async function createEmployee(data: EmployeeFormData) {
    loading.value = true
    error.value = null
    
    try {
      const newEmployee = await employeeService.create(data)
      employees.value.push(newEmployee)
      return { success: true, data: newEmployee }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error creating employee'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateEmployee(id: number, data: Partial<EmployeeFormData>) {
    loading.value = true
    error.value = null
    
    try {
      const updatedEmployee = await employeeService.update(id, data)
      const index = employees.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        employees.value[index] = updatedEmployee
      }
      return { success: true, data: updatedEmployee }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error updating employee'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteEmployee(id: number) {
    loading.value = true
    error.value = null
    
    try {
      await employeeService.delete(id)
      employees.value = employees.value.filter(emp => emp.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error deleting employee'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function setSelectedBranch(branchId: number | null) {
    selectedBranchId.value = branchId
  }

  return {
    employees,
    loading,
    error,
    selectedBranchId,
    
    filteredByBranch,
    hasEmployees,
    isLoading,
    hasError,
    
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setSelectedBranch
  }
})