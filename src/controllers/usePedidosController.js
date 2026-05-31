import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PedidoModel } from '../models/PedidoModel'
import { PedidoDAO } from '../dao/PedidoDAO'

export function usePedidosController() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  
  const [searchParams] = useSearchParams()
  const sucesso = searchParams.get('sucesso')

  const [pedidos, setPedidos] = useState([])
  const [expandido, setExpandido] = useState(null)
  
  const dao = new PedidoDAO()

  async function carregarPedidos() {
    if (usuario?.email) {
      const todos = await dao.readAll()
      const meus = todos.filter(p => p.clienteEmail === usuario.email)
      setPedidos(meus.reverse())
    }
  }

  useEffect(() => {
    carregarPedidos()
  }, [usuario])

  function toggleExpandido(id) {
    setExpandido(expandido === id ? null : id)
  }

  async function handleSolicitarTroca(pedidoId) {
    if (window.confirm('Deseja solicitar a troca/devolução deste pedido? O Administrador avaliará o pedido.')) {
      await dao.update(pedidoId, { status: 'EM TROCA' })
      await carregarPedidos()
    }
  }

  return {
    pedidos, expandido, sucesso, toggleExpandido, handleSolicitarTroca,
    formatarData: PedidoModel.formatarData, navigate
  }
}