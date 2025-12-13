

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  console.log("[v0] AuthProvider rendering")
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthProvider useEffect running")
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      console.log("[v0] Found stored user:", storedUser)
      setUser(JSON.parse(storedUser))
    } else {
      console.log("[v0] No stored user found")
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    console.log("[v0] User logging in:", userData)
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    console.log("[v0] User logging out")
    setUser(null)
    localStorage.removeItem("user")
  }

  console.log("[v0] AuthProvider current state - user:", user, "isLoading:", isLoading)

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
