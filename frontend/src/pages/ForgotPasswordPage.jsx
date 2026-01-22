
import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { forgotPassword } from "../services/api"
import "../styles/Auth.css"

function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("Email is required")
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await forgotPassword(email)
      setIsSubmitted(true)
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header success">
            <CheckCircle size={64} className="success-icon" />
            <h1>Check Your Email</h1>
            <p>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="success-actions">
            <p className="resend-text">
              Didn't receive the email?{" "}
              <button className="resend-btn" onClick={() => setIsSubmitted(false)}>
                Click to resend
              </button>
            </p>
            <Link to="/login" className="back-to-login">
              <ArrowLeft size={20} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/login" className="back-link">
          <ArrowLeft size={20} />
          Back to login
        </Link>

        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">RecipeMine</span>
          </div>
          <h1>Forgot Password?</h1>
          <p>No worries, we'll send you reset instructions</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ marginBottom: "1rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                className={error ? "error" : ""}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
