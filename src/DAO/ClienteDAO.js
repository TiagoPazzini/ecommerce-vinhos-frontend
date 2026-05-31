import { IDAO } from './interfaces/IDAO';

const CHAVE = 'vinho_clientes';

export class ClienteDAO extends IDAO {
  async readAll() {
    const dados = localStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : [];
  }

  async read(id) {
    const clientes = await this.readAll();
    return clientes.find(c => c.id === Number(id)) || null;
  }

  async create(cliente) {
    const clientes = await this.readAll();
    const novoCliente = { ...cliente, id: Date.now(), status: 'ativo' };
    clientes.push(novoCliente);
    localStorage.setItem(CHAVE, JSON.stringify(clientes));
    return novoCliente;
  }

  async update(id, dadosAtualizados) {
    const clientes = await this.readAll();
    const index = clientes.findIndex(c => c.id === Number(id));
    if (index !== -1) {
      clientes[index] = { ...clientes[index], ...dadosAtualizados };
      localStorage.setItem(CHAVE, JSON.stringify(clientes));
      return clientes[index];
    }
    throw new Error('Cliente não encontrado');
  }

  async delete(id) {
    // Exclusão lógica (inativação) conforme sua regra atual
    return await this.update(id, { status: 'inativo' });
  }
}