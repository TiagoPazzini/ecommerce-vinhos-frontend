export class ProdutoModel {
  static filtrarPorTipo(produtos, tipo) {
    if (tipo === 'Todos') return produtos;
    return produtos.filter(v => v.tipo === tipo);
  }
}