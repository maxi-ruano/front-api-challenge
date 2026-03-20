<template>
  <div class="employees-view">
    <div v-if="initialLoad" class="loading">
      Loading employees...
    </div>
    
    <template v-else>
      <header class="header">
        <h1>Employees</h1>
        <button 
          class="btn-primary" 
          @click="openCreateModal"
          :disabled="!selectedBranch"
        >
          + New Employee
        </button>
      </header>

      <div class="branch-selector">
        <label for="branch">Filter by branch:</label>
        <select 
          id="branch" 
          v-model="selectedBranchId"
          @change="handleBranchChange"
        >
          <option :value="null">All branches</option>
          <option 
            v-for="branch in branches" 
            :key="branch.id" 
            :value="branch.id"
          >
            {{ branch.name }}
          </option>
        </select>
      </div>

      <div v-if="isLoading" class="loading">
        Loading employees...
      </div>

      <div v-else-if="hasError" class="error">
        Error: {{ error }}
      </div>

      <div v-else>
        <div v-if="hasEmployees" class="employees-grid">
          <div 
            v-for="employee in filteredByBranch" 
            :key="employee.id" 
            class="employee-card"
          >
            <div class="card-header">
              <h3>{{ employee.name }}</h3>
              <div class="card-actions">
                <button class="btn-edit" @click="openEditModal(employee)">✏️</button>
                <button class="btn-delete" @click="confirmDelete(employee)">🗑️</button>
              </div>
            </div>
            
            <div class="card-body">
              <p><strong>Email:</strong> {{ employee.email }}</p>
              <p><strong>Branch:</strong> {{ getBranchName(employee.branch_id) }}</p>
            </div>
          </div>
        </div>

        <div v-else class="empty">
          No employees found
        </div>
      </div>
    </template>

    <EmployeeForm
      v-if="showForm"
      :show="showForm"
      :employee="selectedEmployee"
      :branches="branches"
      :selected-branch-id="selectedBranchId"
      @close="closeForm"
      @save="handleSave"
    />

    <div v-if="showDeleteConfirm" class="modal confirm-modal">
      <div class="modal-content">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ employeeToDelete?.name }}"?</p>
        <div class="form-actions">
          <button @click="showDeleteConfirm = false" class="btn-cancel">Cancel</button>
          <button @click="handleDelete" class="btn-delete" :disabled="isDeleting">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEmployeeStore } from '@/stores/employeeStore'
import { useBranchStore } from '@/stores/branchStore'
import EmployeeForm from '@/components/employees/EmployeeForm.vue'
import type { Employee, EmployeeFormData } from '@/types'

const route = useRoute()
const router = useRouter()
const employeeStore = useEmployeeStore()
const branchStore = useBranchStore()
const selectedBranchName = ref<string | null>(null) 
const initialLoad = ref(true)

const { 
  employees,
  filteredByBranch,
  isLoading,
  hasError,
  error
} = storeToRefs(employeeStore)

const showForm = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const showDeleteConfirm = ref(false)
const employeeToDelete = ref<Employee | null>(null)
const isDeleting = ref(false)
const selectedBranchId = ref<number | null>(null)

const branches = computed(() => branchStore.branches)
const selectedBranch = computed(() => 
  branches.value.find(b => b.id === selectedBranchId.value)
)

const hasEmployees = computed(() => filteredByBranch.value.length > 0)

onMounted(async () => {
  try {
    await branchStore.fetchBranches()
    
    const branchId = route.query.branch_id
    const branchName = route.query.branch_name
    
    if (branchId) {
      selectedBranchId.value = parseInt(branchId as string)
      selectedBranchName.value = branchName as string
      await employeeStore.fetchEmployees(selectedBranchId.value)
    } else {
      await employeeStore.fetchEmployees()
    }
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    initialLoad.value = false
  }
})

watch(() => route.query.branch_id, (newBranchId) => {
  if (newBranchId) {
    selectedBranchId.value = parseInt(newBranchId as string)
    selectedBranchName.value = route.query.branch_name as string
    employeeStore.fetchEmployees(selectedBranchId.value)
  }
})

const getBranchName = (branchId: number | null) => {
  if (!branchId) return 'No branch'
  const branch = branches.value.find(b => b.id === branchId)
  return branch?.name || 'Unknown'
}

const handleBranchChange = () => {
  employeeStore.setSelectedBranch(selectedBranchId.value)
  if (selectedBranchId.value) {
    const branch = branches.value.find(b => b.id === selectedBranchId.value)
    router.push({ 
      name: 'employees',
      query: { 
        branch_id: selectedBranchId.value.toString(),
        branch_name: branch?.name || ''
      }
    })
    employeeStore.fetchEmployees(selectedBranchId.value)
  } else {
    router.push({ name: 'employees' })
    employeeStore.fetchEmployees()
  }
}

const openCreateModal = () => {
  selectedEmployee.value = null
  showForm.value = true
}

const openEditModal = (employee: Employee) => {
  selectedEmployee.value = { ...employee }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedEmployee.value = null
}

const handleSave = async (data: EmployeeFormData) => {
  if (selectedEmployee.value) {
    const result = await employeeStore.updateEmployee(selectedEmployee.value.id, data)
    if (!result.success) throw new Error(result.error)
  } else {
    const result = await employeeStore.createEmployee(data)
    if (!result.success) throw new Error(result.error)
  }
}

const confirmDelete = (employee: Employee) => {
  employeeToDelete.value = employee
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!employeeToDelete.value) return
  
  isDeleting.value = true
  try {
    const result = await employeeStore.deleteEmployee(employeeToDelete.value.id)
    if (result.success) {
      showDeleteConfirm.value = false
      employeeToDelete.value = null
    }
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.employees-view {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-primary {
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.branch-selector {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.branch-selector select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

.current-filter {
  color: #1976d2;
  font-size: 0.9rem;
}

.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.employee-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.btn-edit:hover {
  background: #e3f2fd;
}

.btn-delete:hover {
  background: #ffebee;
}

.card-body p {
  margin: 4px 0;
  color: #666;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #f44336;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>