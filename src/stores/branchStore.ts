import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Branch, BranchFormData } from '@/types'
import { branchService } from '@/services/branchService'

export const useBranchStore = defineStore('branches', () => {
    const branches = ref<Branch[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const searchQuery = ref('')

    const filteredBranches = computed(() => {


        if (!searchQuery.value) return branches.value

        const query = searchQuery.value.toLowerCase()
        return branches.value.filter(branch =>
            branch.name.toLowerCase().includes(query) ||
            branch.city.toLowerCase().includes(query)
        )
    })

    const hasBranches = computed(() => {
        return branches.value.length > 0
    })

    const isLoading = computed(() => loading.value)
    const hasError = computed(() => error.value !== null)

    async function fetchBranches() {
        loading.value = true
        error.value = null

        try {
            const data = await branchService.getAll()


            branches.value = data
        } catch (err: any) {

            error.value = err.response?.data?.message || 'Error loading branches'
        } finally {
            loading.value = false
        }
    }

    async function createBranch(data: BranchFormData) {
        loading.value = true
        error.value = null

        try {
            const newBranch = await branchService.create(data)
            branches.value.push(newBranch)
            return { success: true, data: newBranch }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Error creating branch'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

async function updateBranch(id: number, data: Partial<BranchFormData>) {
  loading.value = true
  error.value = null
  
  try {
    const updatedBranch = await branchService.update(id, data)
    
    const currentBranch = branches.value.find(b => b.id === id)
    
    const index = branches.value.findIndex(b => b.id === id)
    if (index !== -1) {
      branches.value[index] = {
        ...updatedBranch,
        employees: currentBranch?.employees || []
      }
    }
    return { success: true, data: updatedBranch }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error updating branch'
    return { success: false, error: error.value }
  } finally {
    loading.value = false
  }
}

    async function deleteBranch(id: number) {
        loading.value = true
        error.value = null

        try {
            await branchService.delete(id)
            branches.value = branches.value.filter(b => b.id !== id)
            return { success: true }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Error deleting branch'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    function setSearchQuery(query: string) {
        searchQuery.value = query
    }

    return {
        branches,
        loading,
        error,
        searchQuery,

        filteredBranches,
        hasBranches,
        isLoading,
        hasError,

        fetchBranches,
        createBranch,
        updateBranch,
        deleteBranch,
        setSearchQuery
    }
})