import { IDAO } from './interfaces/IDAO';
import { supabase } from '../services/supabaseClient';

export class ClienteDAO extends IDAO {
  async readAll() {
    const { data, error } = await supabase.from('clientes').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async read(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', Number(id))
      .maybeSingle();

    if (error) return null;
    return data;
  }

  async create(cliente) {
    // Desestrutura o confirmarSenha que não vai pro banco
    const { confirmarSenha, ...dadosParaSalvar } = cliente;
    
    const { data, error } = await supabase
      .from('clientes')
      .insert([{ ...dadosParaSalvar, status: 'ativo' }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id, dadosAtualizados) {
    const { data, error } = await supabase
      .from('clientes')
      .update(dadosAtualizados)
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id) {
    return await this.update(id, { status: 'inativo' });
  }
}