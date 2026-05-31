// src/controllers/useAdminPedidosController.js
import { useState, useEffect } from 'react'
import { PedidoModel } from '../models/PedidoModel'
import { VendaModel } from '../models/VendaModel' // <-- Importante

export function useAdminPedidosController() {
  const [pedidos, setPedidos] = useState([])

  function carregarPedidos() {
    const todos = PedidoModel.listarTodos()
    setPedidos(todos.reverse())
  }

  useEffect(() => { carregarPedidos() }, [])

  function handleMudarStatus(pedidoId, novoStatus) {
    if (window.confirm(`Mudar este pedido para "${novoStatus}"?`)) {
      PedidoModel.atualizarStatus(pedidoId, novoStatus)
      carregarPedidos() 
    }
  }

  // --- NOVAS FUNÇÕES DE TROCA ---

  function handleAutorizarTroca(pedidoId) {
    if (window.confirm('Autorizar a troca deste pedido?')) {
      PedidoModel.atualizarStatus(pedidoId, 'TROCA AUTORIZADA')
      carregarPedidos()
    }
  }

  function handleNegarTroca(pedidoId) {
    if (window.confirm('Negar a troca? O pedido voltará para o status ENTREGUE.')) {
      PedidoModel.atualizarStatus(pedidoId, 'ENTREGUE')
      carregarPedidos()
    }
  }

  function handleConfirmarRecebimento(pedidoId) {
    if (window.confirm('Confirmar recebimento do produto devolvido e gerar cupom de troca?')) {
      const pedido = PedidoModel.buscarPorId(pedidoId)
      
      if (pedido) {
        // 1. Atualiza status para TROCADO
        PedidoModel.atualizarStatus(pedidoId, 'TROCADO')
        
        // 2. Gera o cupom com o valor total da compra
        const codigoCupom = VendaModel.gerarCupomTroca(pedido.total)
        
        alert(`Produto recebido em estoque!\n\nUm cupom de troca foi gerado com sucesso: ${codigoCupom}\nValor: R$ ${pedido.total.toFixed(2)}`)
        carregarPedidos()
      }
    }
  }

  return {
    pedidos,
    handleMudarStatus,
    handleAutorizarTroca,
    handleNegarTroca,
    handleConfirmarRecebimento,
    formatarData: PedidoModel.formatarData
  }
}