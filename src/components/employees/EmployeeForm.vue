<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h3>{{ isEditing ? 'Edit Employee' : 'New Employee' }}</h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Name:</label>
          <input 
            v-model="form.name" 
            type="text" 
            required
            placeholder="Employee name"
          />
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            placeholder="employee@example.com"
          />
        </div>

        <div class="form-group">
          <label>Branch:</label>
          <select v-model="form.branch_id" required>
            <option value="">Select a branch</option>
            <option 
              v-for="branch in branches" 
              :key="branch.id" 
              :value="branch.id"
            >
              {{ branch.name }} - {{ branch.city }}
            </option>
          </select>
        </div>

        <div v-if="formError" class="error-message">
          {{ formError }}
        </div>

        <div class="form-actions">
          <button type="button" @click="close" class="btn-cancel">Cancel</button>
          <button type="submit" class="btn-save" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Employee, EmployeeFormData, Branch } from '@/types'

const props = defineProps<{
  show: boolean
  employee: Employee | null
  branches: Branch[]
  selectedBranchId?: number | null
}>()

const emit = defineEmits(['close', 'save'])

const form = reactive<EmployeeFormData>({
  name: '',
  email: '',
  branch_id: null
})

const isEditing = ref(false)
const isSubmitting = ref(false)
const formError = ref('')

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.branch_id = null
  formError.value = ''
}

watch([() => props.show, () => props.employee], ([newShow, newEmployee]) => {
  
  if (newShow) {
    if (newEmployee) {
      isEditing.value = true
      form.name = newEmployee.name
      form.email = newEmployee.email
      form.branch_id = newEmployee.branch_id
    } else {
      isEditing.value = false
      resetForm()
      if (props.selectedBranchId) {
        form.branch_id = props.selectedBranchId
      }
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  isSubmitting.value = true
  formError.value = ''

  try {
    await emit('save', { ...form })
    close()
  } catch (error: any) {
    console.error('🟪 Error saving:', error)
    formError.value = error.message || 'Error saving employee'
  } finally {
    isSubmitting.value = false
  }
}

const close = () => {
  resetForm()
  emit('close')
}
</script>

<style scoped>
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
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
}

input, select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus, select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
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

.btn-save {
  padding: 8px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save:hover:not(:disabled) {
  background: #1976d2;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background: #ffebee;
  border-radius: 4px;
}
</style>