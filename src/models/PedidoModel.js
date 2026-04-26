// src/models/PedidoModel.js
export class PedidoModel {
  static listarPorCliente(email) {
    const todos = JSON.parse(localStorage.getItem('vinho_pedidos') || '[]')
    const meus = todos.filter(p => p.clienteEmail === email)
    return meus.reverse()
  }

  static formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }
}