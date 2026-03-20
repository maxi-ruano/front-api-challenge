<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h3>{{ isEditing ? 'Edit Branch' : 'New Branch' }}</h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Name:</label>
          <input 
            v-model="form.name" 
            type="text" 
            required
            placeholder="Branch name"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>City:</label>
            <input 
              v-model="form.city" 
              type="text" 
              required
              placeholder="City"
            />
          </div>

          <div class="form-group">
            <label>Country:</label>
            <input 
              v-model="form.country" 
              type="text" 
              required
              placeholder="Country"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Latitude:</label>
            <input 
              v-model="form.latitude" 
              type="number" 
              step="any"
              required
              placeholder="Ej: -34.6037"
            />
          </div>

          <div class="form-group">
            <label>Longitude:</label>
            <input 
              v-model="form.longitude" 
              type="number" 
              step="any"
              required
              placeholder="Ej: -58.3816"
            />
          </div>
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
import type { Branch, BranchFormData } from '@/types'

const props = defineProps<{
  show: boolean
  branch: Branch | null
}>()

const emit = defineEmits(['close', 'save'])

const form = reactive<BranchFormData>({
  name: '',
  city: '',
  country: '',
  latitude: '',
  longitude: ''
})

const isEditing = ref(false)
const isSubmitting = ref(false)
const formError = ref('')

const resetForm = () => {
  form.name = ''
  form.city = ''
  form.country = ''
  form.latitude = ''
  form.longitude = ''
  formError.value = ''
}

watch([() => props.show, () => props.branch], ([newShow, newBranch]) => {
  
  if (newShow) {
    if (newBranch) {
      isEditing.value = true
      form.name = newBranch.name
      form.city = newBranch.city
      form.country = newBranch.country
      form.latitude = newBranch.latitude
      form.longitude = newBranch.longitude
    } else {
      isEditing.value = false
      resetForm()
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  isSubmitting.value = true
  formError.value = ''

  try {
    const dataToSend = {
      ...form,
      latitude: parseFloat(form.latitude as string),
      longitude: parseFloat(form.longitude as string)
    }
    
    await emit('save', dataToSend)
    close()
  } catch (error: any) {
    console.error('🟪 Error saving:', error)
    formError.value = error.message || 'Error saving branch'
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
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