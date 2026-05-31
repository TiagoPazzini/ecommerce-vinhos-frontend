import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClienteDAO } from '../dao/ClienteDAO'

export function useClienteListaController() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [clientes, setClientes] = useState([])
  const dao = new ClienteDAO()

  async function carregarClientes() {
    setClientes(await dao.readAll())
  }

  useEffect(() => { carregarClientes() }, [])

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.email.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpf.includes(busca)
  )

  async function handleInativar(id) {
    if (!window.confirm('Deseja inativar este cliente?')) return
    await dao.delete(id) // O delete do DAO faz a inativação lógica
    await carregarClientes()
  }

  async function handleReativar(id) {
    if (!window.confirm('Deseja reativar este cliente?')) return
    await dao.update(id, { status: 'ativo' })
    await carregarClientes()
  }

  return { busca, setBusca, clientesFiltrados, handleInativar, handleReativar, navigate }
}