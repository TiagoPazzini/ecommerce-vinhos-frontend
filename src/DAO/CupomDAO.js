import { IDAO } from './interfaces/IDAO';
import { supabase } from '../services/supabaseClient';

export class CupomDAO extends IDAO {
  async readAll() {
    const { data, error } = await supabase.from('cupons').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async read(codigo) {
    const { data, error } = await supabase
      .from('cupons')
      .select('*')
      .eq('codigo', codigo.toUpperCase())
      .maybeSingle();

    if (error || !data) return null;
    return data;
  }

  async create(cupom) {
    const { data, error } = await supabase
      .from('cupons')
      .insert([cupom])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}