import { IDAO } from './interfaces/IDAO';

const CHAVE = 'vinho_carrinho';

export class CarrinhoDAO extends IDAO {
  async readAll() {
    const dados = localStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : [];
  }

  async update(idIgnorado, carrinhoCompleto) {
    // O carrinho salva a coleção inteira de uma vez
    localStorage.setItem(CHAVE, JSON.stringify(carrinhoCompleto));
    return carrinhoCompleto;
  }
  
  async create(data) { throw new Error("Use update() para salvar o carrinho"); }
  async read(id) { throw new Error("O carrinho não busca por ID no formato atual"); }
  async delete(id) { throw new Error("Use update() com array vazio para limpar"); }
}