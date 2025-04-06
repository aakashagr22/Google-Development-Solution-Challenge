"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem("greentrack_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("greentrack_user")
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - in a real app, this would be an API call
      if (email === "demo@greentrack.org" && password === "password") {
        const mockUser: User = {
          id: "user-1",
          name: "Demo User",
          email: "demo@greentrack.org",
          role: "user",
          avatar: "/placeholder.svg?height=32&width=32",
        }
        setUser(mockUser)
        localStorage.setItem("greentrack_user", JSON.stringify(mockUser))
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
        return true
      } else if (email === "admin@greentrack.org" && password === "admin") {
        const mockUser: User = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@greentrack.org",
          role: "admin",
          avatar: "/placeholder.svg?height=32&width=32",
        }
        setUser(mockUser)
        localStorage.setItem("greentrack_user", JSON.stringify(mockUser))
        toast({
          title: "Welcome back, Admin!",
          description: "You have successfully signed in.",
        })
        return true
      } else {
        toast({
          title: "Sign in failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in failed",
        description: "An error occurred during sign in. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration - in a real app, this would be an API call
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: "user",
        avatar: "/placeholder.svg?height=32&width=32",
      }
      setUser(mockUser)
      localStorage.setItem("greentrack_user", JSON.stringify(mockUser))
      toast({
        title: "Account created!",
        description: "You have successfully signed up.",
      })
      return true
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "Sign up failed",
        description: "An error occurred during sign up. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("greentrack_user")
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

