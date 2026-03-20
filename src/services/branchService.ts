import api from './api'
import type { Branch, BranchFormData } from '@/types'

export const branchService = {
    async getAll() {
        try {
            const response = await api.get('/branches')

            const branchesData = response.data.data


            return branchesData
        } catch (error) {
            throw error
        }
    },

    async getById(id: number) {
        const response = await api.get(`/branches/${id}`)
        return response.data.data
    },

    async create(data: BranchFormData) {
        const response = await api.post('/branches', data)
        return response.data.data
    },

    async update(id: number, data: Partial<BranchFormData>) {
        const response = await api.put(`/branches/${id}`, data)
        return response.data.data
    },

    async delete(id: number) {
        const response = await api.delete(`/branches/${id}`)
        return response.data
    },

    async search(query: string) {
        const response = await api.get('/branches/search', {
            params: { q: query }
        })
        return response.data.data
    }
}