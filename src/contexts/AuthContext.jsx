import { createContext, useContext, useState } from 'react'
import { AuthModel } from '../models/AuthModel'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => AuthModel.carregarSessao())

  function login(dados) {
    setUsuario(dados)
    AuthModel.salvarSessao(dados)
  }

  function logout() {
    setUsuario(null)
    AuthModel.salvarSessao(dados)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}