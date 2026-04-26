// src/controllers/useLoginController.js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthModel } from '../models/AuthModel'

export function useLoginController() {
  const navigate = useNavigate()
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

      // Redireciona com base no perfil
      if (usuarioAutenticado.perfil === 'admin') {
        navigate('/admin/clientes')
      } else {
        navigate('/')
      }
    } catch (error) {
      // Captura o erro do Model e joga na tela
      setErro(error.message)
    }
  }

  return {
    aba, setAba, form, erro, setErro,
    handleChange, handleSubmit
  }
}