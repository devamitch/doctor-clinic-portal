import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, AuthState, LoginCredentials, RegisterData } from "@/types/auth"

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  completeOnboarding: () => void
  setLoading: (loading: boolean) => void
}

// Mock user data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1990-01-15",
  gender: "male",
  bloodType: "O+",
  allergies: ["Peanuts", "Shellfish"],
  emergencyContact: {
    name: "Jane Doe",
    phone: "+1 (555) 987-6543",
    relationship: "Spouse",
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasCompletedOnboarding: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock authentication - in real app, validate with backend
        if (credentials.email && credentials.password) {
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          set({ isLoading: false })
          throw new Error("Invalid credentials")
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        if (data.password !== data.confirmPassword) {
          set({ isLoading: false })
          throw new Error("Passwords do not match")
        }

        const newUser: User = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          phone: data.phone,
        }

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          hasCompletedOnboarding: false,
        })
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          })
        }
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    },
  ),
)
