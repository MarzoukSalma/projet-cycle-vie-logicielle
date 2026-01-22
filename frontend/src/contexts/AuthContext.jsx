import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token") // Changed from "authToken"
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // ✅ Now accepts BOTH userData and token
  const login = (userData, token) => {
    console.log("🔐 AuthContext login called with:", userData)
    console.log("🔐 Token received:", token)

    // Validation
    if (!userData || typeof userData !== 'object' || !userData.id) {
      console.error("❌ Invalid userData passed to login:", userData)
      return
    }

    if (!token) {
      console.error("❌ No token provided to login!")
      return
    }

    // ✅ Store both user and token
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token) // Consistent key name
    
    console.log("✅ User and token saved successfully")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token") // Changed from "authToken"
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}