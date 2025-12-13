import React from "react"
import ReactDOM from "react-dom/client"
import "./App.css"
import App from "./App"

console.log("[v0] Starting application initialization")

const root = ReactDOM.createRoot(document.getElementById("root"))
console.log("[v0] Root element created")

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log("[v0] App rendered")
