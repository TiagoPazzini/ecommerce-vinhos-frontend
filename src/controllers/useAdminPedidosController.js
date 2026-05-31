import { useState, useEffect } from 'react'
import { PedidoModel } from '../models/PedidoModel'
import { VendaModel } from '../models/VendaModel'
import { PedidoDAO } from '../dao/PedidoDAO'
import { CupomDAO } from '../dao/CupomDAO'

export function useAdminPedidosController() {
  const [pedidos, setPedidos] = useState([])
  const pedidoDao = new PedidoDAO()
  const cupomDao = new CupomDAO()

  async function carregarPedidos() {
    const todos = await pedidoDao.readAll()
    setPedidos(todos.reverse())
  }

  useEffect(() => { carregarPedidos() }, [])

  async function handleMudarStatus(pedidoId, novoStatus) {
    if (window.confirm(`Mudar este pedido para "${novoStatus}"?`)) {
      await pedidoDao.update(pedidoId, { status: novoStatus })
      await carregarPedidos() 
    }
  }

  async function handleAutorizarTroca(pedidoId) {
    if (window.confirm('Autorizar a troca deste pedido?')) {
      await pedidoDao.update(pedidoId, { status: 'TROCA AUTORIZADA' })
      await carregarPedidos()
    }
  }

  async function handleNegarTroca(pedidoId) {
    if (window.confirm('Negar a troca? O pedido voltará para o status ENTREGUE.')) {
      await pedidoDao.update(pedidoId, { status: 'ENTREGUE' })
      await carregarPedidos()
    }
  }

  async function handleConfirmarRecebimento(pedidoId) {
    if (window.confirm('Confirmar recebimento do produto devolvido e gerar cupom de troca?')) {
      const pedido = await pedidoDao.read(pedidoId)
      
      if (pedido) {
        await pedidoDao.update(pedidoId, { status: 'TROCADO' })
        
        const codigoCupom = VendaModel.gerarCodigoCupomTroca()
        await cupomDao.create({ codigo: codigoCupom, tipo: 'troca', valor: pedido.total })
        
        alert(`Produto recebido em estoque!\n\nUm cupom de troca foi gerado com sucesso: ${codigoCupom}\nValor: R$ ${pedido.total.toFixed(2)}`)
        await carregarPedidos()
      }
    }
  }

  return {
    pedidos, handleMudarStatus, handleAutorizarTroca,
    handleNegarTroca, handleConfirmarRecebimento, formatarData: PedidoModel.formatarData
  }
}