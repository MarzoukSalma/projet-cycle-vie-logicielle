// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADhJLclVRfyFXgQNb8o9zOgCaC9oGawMQ",
  authDomain: "recipemine-b5de7.firebaseapp.com",
  projectId: "recipemine-b5de7",
  storageBucket: "recipemine-b5de7.firebasestorage.app",
  messagingSenderId: "669603932123",
  appId: "1:669603932123:web:90567a7043a835567669fe",
  measurementId: "G-0VE7KL6MPY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };