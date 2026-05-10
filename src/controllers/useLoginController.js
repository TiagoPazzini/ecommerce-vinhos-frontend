// src/controllers/useLoginController.js
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthModel } from '../models/AuthModel'

export function useLoginController() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [aba, setAba] = useState('login')
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    try {
      setErro('')

      // Manda o Model validar
      const usuarioAutenticado = AuthModel.autenticar(form.email, form.senha)

      // Atualiza o estado global da aplicação
      login(usuarioAutenticado)
      
      const destino = location.state?.from?.pathname ||
        (usuarioAutenticado.perfil === 'admin' ? '/admin/clientes' : '/')

      navigate(destino, { replace: true }) // Redireciona para o destino final

    } catch (error) {
      setErro(error.message)
    }
  }

  return {
    aba, setAba, form, erro, setErro,
    handleChange, handleSubmit
  }
}