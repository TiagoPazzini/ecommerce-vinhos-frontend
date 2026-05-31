// src/models/PedidoModel.js
export class PedidoModel {
  
  // Lista todos os pedidos (Para o Admin)
  static listarTodos() {
    return JSON.parse(localStorage.getItem('vinho_pedidos') || '[]')
  }

  static buscarPorId(id) {
    return this.listarTodos().find(p => p.id === id) || null
  }

  // Lista os pedidos de um cliente específico (Para a tela Meus Pedidos)
  static listarPorCliente(email) {
    const todos = this.listarTodos()
    const meus = todos.filter(p => p.clienteEmail === email)
    return meus.reverse() // Mostra os mais recentes primeiro
  }

  // Atualiza o status de um pedido específico
  static atualizarStatus(pedidoId, novoStatus) {
    const pedidos = this.listarTodos()
    const atualizados = pedidos.map(p => 
      p.id === pedidoId ? { ...p, status: novoStatus } : p
    )
    localStorage.setItem('vinho_pedidos', JSON.stringify(atualizados))
  }

  static formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }
}