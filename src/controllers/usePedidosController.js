// src/controllers/usePedidosController.js
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PedidoModel } from '../models/PedidoModel'

export function usePedidosController() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  
  const [searchParams] = useSearchParams()
  const sucesso = searchParams.get('sucesso')

  const [pedidos, setPedidos] = useState([])
  const [expandido, setExpandido] = useState(null) // Controla qual pedido está aberto

  useEffect(() => {
    if (usuario?.email) {
      setPedidos(PedidoModel.listarPorCliente(usuario.email))
    }
  }, [usuario])

  // Função para alternar a exibição dos detalhes do pedido
  function toggleExpandido(id) {
    setExpandido(expandido === id ? null : id)
  }

  return {
    pedidos,
    expandido,
    sucesso,
    toggleExpandido,
    formatarData: PedidoModel.formatarData,
    navigate
  }
}