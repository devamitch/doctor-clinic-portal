export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
  bloodType?: string
  allergies?: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  hasCompletedOnboarding: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}
