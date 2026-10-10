"use client"

import type React from "react"
import { useState } from "react"
import { LoginScreen } from "./LoginScreen"
import { RegisterScreen } from "./RegisterScreen"

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  return isLogin ? (
    <LoginScreen onNavigateToRegister={() => setIsLogin(false)} />
  ) : (
    <RegisterScreen onNavigateToLogin={() => setIsLogin(true)} />
  )
}
