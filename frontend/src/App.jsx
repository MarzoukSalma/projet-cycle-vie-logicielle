import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import DiscoverPage from "./pages/DiscoverPage"
import ProfilePage from "./pages/ProfilePage"
import CreateRecipePage from "./pages/CreateRecipePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import RecipeDetailPage from "./pages/RecipeDetailPage"
import EditProfilePage from "./pages/EditProfilePage"
import "./App.css"

console.log("[v0] App component loaded")

function App() {
  console.log("[v0] App component rendering")

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/create-recipe" element={<CreateRecipePage />} />
            <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
