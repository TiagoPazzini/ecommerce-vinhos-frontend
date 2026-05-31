import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ClienteDAO } from '../dao/ClienteDAO'

export function useMeuPerfilController() {
  const { usuario } = useAuth()
  const [cliente, setCliente] = useState(null)
  const [mensagem, setMensagem] = useState('')
  
  const dao = new ClienteDAO()

  useEffect(() => {
    async function carregarPerfil() {
      if (usuario?.email) {
        const todosClientes = await dao.readAll()
        const clienteLogado = todosClientes.find(c => c.email === usuario.email)
        if (clienteLogado) {
          setCliente(clienteLogado)
        }
      }
    }
    carregarPerfil()
  }, [usuario])

  function handleChange(e) {
    setCliente({ ...cliente, [e.target.name]: e.target.value })
  }

  async function handleSalvar(e) {
    e.preventDefault()
    try {
      await dao.update(cliente.id, cliente)
      setMensagem('Dados atualizados com sucesso!')
      setTimeout(() => setMensagem(''), 3000)
    } catch (error) {
      setMensagem(`Erro: ${error.message}`)
    }
  }

  function handleRemoverEndereco(index) {
    if (cliente.enderecos.length <= 1) return alert('Você deve ter pelo menos um endereço.')
    const novos = cliente.enderecos.filter((_, i) => i !== index)
    setCliente({ ...cliente, enderecos: novos })
  }

  function handleRemoverCartao(index) {
    const novos = cliente.cartoes.filter((_, i) => i !== index)
    setCliente({ ...cliente, cartoes: novos })
  }

  return {
    cliente, mensagem, handleChange, handleSalvar,
    handleRemoverEndereco, handleRemoverCartao
  }
}