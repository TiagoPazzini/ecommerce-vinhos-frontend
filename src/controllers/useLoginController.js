import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthModel } from '../models/AuthModel'
import { ClienteDAO } from '../dao/ClienteDAO'

export function useLoginController() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [aba, setAba] = useState('login')
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setErro('')

      const dao = new ClienteDAO()
      const clientes = await dao.readAll()

      const usuarioAutenticado = AuthModel.autenticar(form.email, form.senha, clientes)

      login(usuarioAutenticado)
      
      const destino = usuarioAutenticado.perfil === 'admin' 
                ? '/admin/clientes' 
                : (location.state?.from?.pathname || '/')
      
      navigate(destino, { replace: true })
    } catch (error) {
      setErro(error.message)
    } 
  }

  return { aba, setAba, form, erro, setErro, handleChange, handleSubmit }
}