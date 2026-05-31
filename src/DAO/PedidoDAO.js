import { IDAO } from './interfaces/IDAO';

const CHAVE = 'vinho_pedidos';

export class PedidoDAO extends IDAO {
  async readAll() {
    const dados = localStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : [];
  }

  async read(id) {
    const pedidos = await this.readAll();
    return pedidos.find(p => p.id === Number(id)) || null;
  }

  async create(pedido) {
    const pedidos = await this.readAll();
    pedidos.push(pedido);
    localStorage.setItem(CHAVE, JSON.stringify(pedidos));
    return pedido;
  }

  async update(id, dadosAtualizados) {
    const pedidos = await this.readAll();
    const index = pedidos.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      pedidos[index] = { ...pedidos[index], ...dadosAtualizados };
      localStorage.setItem(CHAVE, JSON.stringify(pedidos));
      return pedidos[index];
    }
    throw new Error('Pedido não encontrado');
  }

  async delete(id) {
    throw new Error("Pedidos não podem ser deletados fisicamente");
  }
}