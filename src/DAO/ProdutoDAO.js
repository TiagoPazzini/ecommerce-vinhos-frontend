import { IDAO } from './interfaces/IDAO';
import { supabase } from '../services/supabaseClient';

export class ProdutoDAO extends IDAO {
  async readAll() {
    // Busca tudo do Postgres ordenado por ID de forma limpa
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    
    // Pequeno ajuste para mapear o padrão camelCase que a sua UI espera
    return data.map(p => ({
      id: p.id, nome: p.nome, tipo: p.tipo, uva: p.uva, pais: p.pais, regiao: p.regiao,
      teorAlcoolico: p.teor_alcoolico, docura: p.docura, preco: Number(p.preco),
      safra: p.safra, harmonizacao: p.harmonizacao
    }));
  }

  async read(id) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', Number(id))
      .single();

    if (error) return null;
    return {
      id: data.id, nome: data.nome, tipo: data.tipo, uva: data.uva, pais: data.pais, regiao: data.regiao,
      teorAlcoolico: data.teor_alcoolico, docura: data.docura, preco: Number(data.preco),
      safra: data.safra, harmonizacao: data.harmonizacao
    };
  }
}