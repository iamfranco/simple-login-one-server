import React, { useContext } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoggedOut from "./Components/LoggedOut"
import Homepage from "./Components/Homepage"
import LoginPage from "./Components/LoginPage"
import RegisterPage from "./Components/RegisterPage"
import "./GlobalStyles.css"
import { myContext } from "./Context"
import AboutPage from "./Components/AboutPage"

function App() {
  const { userObject } = useContext(myContext)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={userObject ? <Homepage /> : <LoggedOut />} />
        <Route path="/login" element={userObject ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={userObject ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/about" element={userObject ? <AboutPage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
