<template>
  <div class="branches-view">
    <header class="header">
      <h1>Branches</h1>
      <button class="btn-primary" @click="openCreateModal">
        + New Branch
      </button>
    </header>

    <div class="search-bar">
      <input 
        type="text" 
        placeholder="Search by name or city..."
        v-model="searchQuery"
        @input="handleSearch"
      />
    </div>

    <div v-if="store.isLoading" class="loading">
      Loading branches...
    </div>

    <div v-else-if="store.hasError" class="error">
      Error: {{ store.error }}
    </div>

    <div v-else>
      <div v-if="store.hasBranches" class="branches-grid">
        <div 
          v-for="branch in store.filteredBranches" 
          :key="branch.id" 
          class="branch-card"
        >
          <div class="card-header">
            <h3>{{ branch.name }}</h3>
            <div class="card-actions">
              <button class="btn-edit" @click="openEditModal(branch)">✏️</button>
              <button class="btn-delete" @click="confirmDelete(branch)">🗑️</button>
            </div>
          </div>
          
          <div class="card-body">
            <p>{{ branch.city }}, {{ branch.country }}</p>
            <p>Lat: {{ branch.latitude }}, Lon: {{ branch.longitude }}</p>
            
            <div v-if="branch.weather" class="weather-info">
              <p>🌡️ {{ branch.weather.temperature }}°C</p>
              <p>🌬️ {{ branch.weather.windspeed }} km/h</p>
            </div>
          <div class="employee-section">
    <span class="employee-count">👥 {{ branch.employees?.length || 0 }} employees</span>
    <button 
      v-if="branch.employees?.length" 
      class="btn-view-employees" 
      @click="viewEmployees(branch)"
    >
      View
    </button>
    <span v-else class="no-employees">No employees</span>
  </div>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        No branches found
      </div>
    </div>

    <BranchForm
      v-if="showForm"
      :show="showForm"
      :branch="selectedBranch"
      @close="closeForm"
      @save="handleSave"
    />

    <div v-if="showDeleteConfirm" class="modal confirm-modal">
      <div class="modal-content">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ branchToDelete?.name }}"?</p>
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
import { ref } from 'vue'
import { useBranchStore } from '@/stores/branchStore'
import { storeToRefs } from 'pinia'
import BranchForm from '@/components/branches/BranchForm.vue'
import type { Branch, BranchFormData } from '@/types'
import { useRouter } from 'vue-router'

const store = useBranchStore()
const router = useRouter()
const { searchQuery } = storeToRefs(store)
const { setSearchQuery, fetchBranches, createBranch, updateBranch, deleteBranch } = store

const showForm = ref(false)
const selectedBranch = ref<Branch | null>(null)
const showDeleteConfirm = ref(false)
const branchToDelete = ref<Branch | null>(null)
const isDeleting = ref(false)

fetchBranches()

const handleSearch = () => {
  setSearchQuery(searchQuery.value)
}

const openCreateModal = () => {
  selectedBranch.value = null
  showForm.value = true
}

const openEditModal = (branch: Branch) => {
  selectedBranch.value = { ...branch }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedBranch.value = null
}

const handleSave = async (data: BranchFormData) => {
  if (selectedBranch.value) {
    const result = await updateBranch(selectedBranch.value.id, data)
    if (!result.success) throw new Error(result.error)
  } else {
    const result = await createBranch(data)
    if (!result.success) throw new Error(result.error)
  }
}

const confirmDelete = (branch: Branch) => {
  branchToDelete.value = branch
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!branchToDelete.value) return
  
  isDeleting.value = true
  try {
    const result = await deleteBranch(branchToDelete.value.id)
    if (result.success) {
      showDeleteConfirm.value = false
      branchToDelete.value = null
    }
  } finally {
    isDeleting.value = false
  }
}
const viewEmployees = (branch: Branch) => {
  router.push({ 
    name: 'employees',
    query: { 
      branch_id: branch.id.toString(),
      branch_name: branch.name
    }
  })
}
</script>

<style scoped>
.branches-view {
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

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.branches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.branch-card {
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

.weather-info {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  display: flex;
  gap: 20px;
  justify-content: center;
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

.btn-delete {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete:hover:not(:disabled) {
  background: #d32f2f;
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.employee-section {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.employee-count {
  font-size: 0.9rem;
  color: #555;
}

.btn-view-employees {
  background: none;
  border: 1px solid #2196f3;
  color: #2196f3;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view-employees:hover {
  background: #2196f3;
  color: white;
}

.no-employees {
  font-size: 0.85rem;
  color: #999;
  font-style: italic;
}
</style>