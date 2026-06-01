import { IDAO } from './interfaces/IDAO';

// Mock atualizado com RN0072 (Teor Alcoólico, País/Região) e RN0073 (Doçura)
const vinhosMock = [
  { 
    id: 1, nome: 'Château Margaux', tipo: 'Tinto', uva: 'Cabernet Sauvignon', 
    pais: 'França', regiao: 'Bordeaux', teorAlcoolico: 13.5, docura: 'Seco',
    preco: 890.00, safra: 2018, harmonizacao: ['Carnes vermelhas', 'Queijos finos'] 
  },
  { 
    id: 2, nome: 'Concha y Toro Gran Reserva', tipo: 'Tinto', uva: 'Carménère', 
    pais: 'Chile', regiao: 'Vale do Maipo', teorAlcoolico: 14.0, docura: 'Seco',
    preco: 189.00, safra: 2020, harmonizacao: ['Carnes vermelhas', 'Massas'] 
  },
  { 
    id: 3, nome: 'Santa Julia Rosé', tipo: 'Rosé', uva: 'Malbec', 
    pais: 'Argentina', regiao: 'Mendoza', teorAlcoolico: 12.5, docura: 'Meio Seco',
    preco: 97.00, safra: 2022, harmonizacao: ['Saladas', 'Peixes e frutos do mar'] 
  },
  { 
    id: 4, nome: 'Veuve Clicquot Brut', tipo: 'Espumante', uva: 'Chardonnay', 
    pais: 'França', regiao: 'Champagne', teorAlcoolico: 12.0, docura: 'Seco',
    preco: 620.00, safra: 2019, harmonizacao: ['Sobremesas', 'Queijos finos'] 
  },
  { 
    id: 5, nome: 'Quinta do Crasto', tipo: 'Tinto', uva: 'Touriga Nacional', 
    pais: 'Portugal', regiao: 'Douro', teorAlcoolico: 14.5, docura: 'Seco',
    preco: 210.00, safra: 2019, harmonizacao: ['Carnes vermelhas', 'Queijos finos'] 
  },
  { 
    id: 6, nome: 'Casas del Bosque Riesling', tipo: 'Branco', uva: 'Riesling', 
    pais: 'Chile', regiao: 'Casablanca', teorAlcoolico: 13.0, docura: 'Meio Seco',
    preco: 134.00, safra: 2021, harmonizacao: ['Peixes e frutos do mar', 'Saladas'] 
  },
  { 
    id: 7, nome: 'Cloudy Bay Sauvignon Blanc', tipo: 'Branco', uva: 'Sauvignon Blanc', 
    pais: 'Nova Zelândia', regiao: 'Marlborough', teorAlcoolico: 13.5, docura: 'Seco',
    preco: 245.00, safra: 2022, harmonizacao: ['Peixes e frutos do mar', 'Saladas'] 
  },
  { 
    id: 8, nome: 'Moët & Chandon Impérial', tipo: 'Espumante', uva: 'Pinot Noir', 
    pais: 'França', regiao: 'Champagne', teorAlcoolico: 12.0, docura: 'Meio Seco',
    preco: 380.00, safra: 2020, harmonizacao: ['Sobremesas', 'Peixes e frutos do mar'] 
  },
  { 
    id: 9, nome: 'Porto Messias Ruby', tipo: 'Tinto', uva: 'Blend', 
    pais: 'Portugal', regiao: 'Douro', teorAlcoolico: 19.5, docura: 'Suave/Doce',
    preco: 150.00, safra: 2021, harmonizacao: ['Sobremesas', 'Queijos finos'] 
  }
];

export class ProdutoDAO extends IDAO {
  async readAll() {
    return vinhosMock;
  }

  async read(id) {
    return vinhosMock.find(p => p.id === Number(id)) || null;
  }

  async create(data) { throw new Error("Ainda não implementado para produtos"); }
  async update(id, data) { throw new Error("Ainda não implementado para produtos"); }
  async delete(id) { throw new Error("Ainda não implementado para produtos"); }
}