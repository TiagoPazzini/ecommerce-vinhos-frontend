

const vinhosMock = [
  { id: 1, nome: 'Château Margaux', tipo: 'Tinto', uva: 'Cabernet Sauvignon', regiao: 'Bordeaux, França', preco: 890.00, safra: 2018, harmonizacao: ['Carnes vermelhas', 'Queijos'] },
  { id: 2, nome: 'Concha y Toro Gran Reserva', tipo: 'Tinto', uva: 'Carménère', regiao: 'Vale do Maipo, Chile', preco: 189.00, safra: 2020, harmonizacao: ['Carnes vermelhas', 'Massas'] },
  { id: 3, nome: 'Santa Julia Rosé', tipo: 'Rosé', uva: 'Malbec', regiao: 'Mendoza, Argentina', preco: 97.00, safra: 2022, harmonizacao: ['Saladas', 'Peixes'] },
  { id: 4, nome: 'Veuve Clicquot Brut', tipo: 'Espumante', uva: 'Chardonnay', regiao: 'Champagne, França', preco: 620.00, safra: 2019, harmonizacao: ['Sobremesas', 'Queijos'] },
  { id: 5, nome: 'Quinta do Crasto', tipo: 'Tinto', uva: 'Touriga Nacional', regiao: 'Douro, Portugal', preco: 210.00, safra: 2019, harmonizacao: ['Carnes vermelhas', 'Queijos'] },
  { id: 6, nome: 'Casas del Bosque Riesling', tipo: 'Branco', uva: 'Riesling', regiao: 'Casablanca, Chile', preco: 134.00, safra: 2021, harmonizacao: ['Peixes', 'Frutos do mar'] },
  { id: 7, nome: 'Cloudy Bay Sauvignon Blanc', tipo: 'Branco', uva: 'Sauvignon Blanc', regiao: 'Marlborough, Nova Zelândia', preco: 245.00, safra: 2022, harmonizacao: ['Peixes', 'Saladas'] },
  { id: 8, nome: 'Moët & Chandon Impérial', tipo: 'Espumante', uva: 'Pinot Noir', regiao: 'Champagne, França', preco: 380.00, safra: 2020, harmonizacao: ['Sobremesas', 'Frutos do mar'] },
]

export class ProdutoModel {
  static listarPorTipo(tipo) {
    if (tipo === 'Todos') return vinhosMock
    return vinhosMock.filter(v => v.tipo === tipo)
  }
}