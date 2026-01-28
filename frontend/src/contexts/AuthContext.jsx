import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ used to trigger re-fetch after login/logout
  const [authVersion, setAuthVersion] = useState(0)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("authToken") // ✅ consistent with api.js

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  const login = (userData, token) => {
    if (!userData || typeof userData !== "object" || !userData.id) {
      console.error("❌ Invalid userData passed to login:", userData)
      return
    }
    if (!token) {
      console.error("❌ No token provided to login!")
      return
    }

    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("authToken", token) // ✅ consistent with api.js
    setAuthVersion((v) => v + 1) // ✅ refresh
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    setUser(null)
    setAuthVersion((v) => v + 1) // ✅ refresh
  }
  
  const updateUser = (partialOrFullUser) => {
  if (!partialOrFullUser || typeof partialOrFullUser !== "object" || !partialOrFullUser.id) {
    console.error("❌ Invalid user passed to updateUser:", partialOrFullUser)
    return
  }

  setUser(partialOrFullUser)
  localStorage.setItem("user", JSON.stringify(partialOrFullUser))
  setAuthVersion((v) => v + 1)
}


  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, authVersion , updateUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
