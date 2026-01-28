import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { loginUser } from "../services/api"
import "../styles/Auth.css"

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [rememberMe, setRememberMe] = useState(true) // ✅ par défaut ON (comme beaucoup d’apps)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
    if (errors.general) setErrors((prev) => ({ ...prev, general: "" }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email"

    if (!formData.password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const persistAuth = (user, token, remember) => {
    // ✅ Clean old storage to avoid conflicts
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("authToken")

    if (remember) {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("authToken", token)
    } else {
      sessionStorage.setItem("user", JSON.stringify(user))
      sessionStorage.setItem("authToken", token)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await loginUser(formData.email, formData.password)

      if (!response?.token) throw new Error("No token received from server")
      if (!response?.user) throw new Error("No user data received from server")

      // ✅ Store based on rememberMe
      persistAuth(response.user, response.token, rememberMe)

      // ✅ Update AuthContext (it uses localStorage)
      // If rememberMe is false, we still call login so the session works now,
      // but after refresh it won't auto-login (expected).
      login(response.user, response.token)

      navigate("/")
    } catch (error) {
      console.error("❌ Login error:", error)
      setErrors((prev) => ({
        ...prev,
        general: error.message || "Login failed. Please try again.",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">RecipeMine</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your recipes</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message" style={{ marginBottom: "1rem", textAlign: "center" }}>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn google" type="button">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Google
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
