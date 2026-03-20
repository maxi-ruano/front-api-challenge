export interface Branch {
  id: number
  name: string
  city: string
  country: string
  latitude: number
  longitude: number
  employees_count?: number
}

export interface BranchFormData {
  name: string
  city: string
  country: string
  latitude: number | string
  longitude: number | string
}

export interface Employee {
  id: number
  name: string
  email: string
  branch_id: number
  branch?: Branch
}

export interface EmployeeFormData {
  name: string
  email: string
  branch_id: number | null
}

export interface WeatherData {
  temperature: number
  windspeed: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}