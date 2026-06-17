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
    const pedidosOrdenados = todos.sort((a, b) => b.id - a.id);
    setPedidos(pedidosOrdenados);
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

  // Dentro de src/controllers/useAdminPedidosController.js
  async function handleConfirmarRecebimento(pedidoId) {
    if (window.confirm('Confirmar recebimento do produto devolvido e gerar cupom de troca?')) {
      const pedido = await pedidoDao.read(pedidoId)

      if (pedido) {
        await pedidoDao.update(pedidoId, { status: 'TROCADO' })

        // 📊 CÁLCULO PROPORCIONAL: Verifica se há flag de item parcial, senão usa o total padrão (preserva o Cypress)
        const temItemParcial = pedido.itens.some(item => item.emTroca);
        const valorCupom = temItemParcial
          ? pedido.itens.reduce((total, item) => item.emTroca ? total + (Number(item.produto.preco) * Number(item.qtdTroca)) : total, 0)
          : pedido.total;

        const codigoCupom = VendaModel.gerarCodigoCupomTroca()
        await cupomDao.create({ codigo: codigoCupom, tipo: 'troca', valor: valorCupom })

        alert(`Produto recebido em estoque!\n\nUm cupom de troca parcial foi gerado com sucesso: ${codigoCupom}\nValor creditado: R$ ${valorCupom.toFixed(2)}`)
        await carregarPedidos()
      }
    }
  }

  return {
    pedidos, handleMudarStatus, handleAutorizarTroca,
    handleNegarTroca, handleConfirmarRecebimento, formatarData: PedidoModel.formatarData
  }
}