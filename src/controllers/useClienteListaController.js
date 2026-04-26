import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClienteModel } from '../models/ClienteModel'

export function useClienteListaController() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [clientes, setClientes] = useState([])

  // Carrega clientes ao montar a tela
  useEffect(() => {
    setClientes(ClienteModel.listar())
  }, [])

  // Aplica o filtro de busca
  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.email.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpf.includes(busca)
  )

  function handleInativar(id) {
    if (!window.confirm('Deseja inativar este cliente?')) return
    ClienteModel.inativar(id)
    setClientes(ClienteModel.listar()) // Atualiza a tela
  }

  function handleReativar(id) {
    if (!window.confirm('Deseja reativar este cliente?')) return
    ClienteModel.reativar(id)
    setClientes(ClienteModel.listar()) // Atualiza a tela
  }

  return {
    busca, setBusca, clientesFiltrados,
    handleInativar, handleReativar, navigate
  }
}