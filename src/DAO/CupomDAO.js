import { IDAO } from './interfaces/IDAO';

const CHAVE = 'vinho_cupons';

export class CupomDAO extends IDAO {
  async readAll() {
    const dados = localStorage.getItem(CHAVE);
    if (!dados) {
      const iniciais = [
        { codigo: 'PROMO10', tipo: 'promocional', valor: 10 },
        { codigo: 'TROCA20', tipo: 'troca', valor: 20 },
      ];
      localStorage.setItem(CHAVE, JSON.stringify(iniciais));
      return iniciais;
    }
    return JSON.parse(dados);
  }

  async read(codigo) {
    const cupons = await this.readAll();
    return cupons.find(c => c.codigo === codigo.toUpperCase()) || null;
  }

  async create(cupom) {
    const cupons = await this.readAll();
    cupons.push(cupom);
    localStorage.setItem(CHAVE, JSON.stringify(cupons));
    return cupom;
  }

  async update(id, data) { throw new Error("Cupons não são editados, apenas criados ou inativados"); }
  async delete(id) { throw new Error("Exclusão de cupom não implementada"); }
}