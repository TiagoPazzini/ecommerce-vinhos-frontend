import { IDAO } from './interfaces/IDAO';
import { supabase } from '../services/supabaseClient';

export class ClienteDAO extends IDAO {
  async readAll() {
    const { data, error } = await supabase.from('clientes').select('*');
    if (error) throw new Error(error.message);
    return data.map(c => this.mapearParaFrontend(c));
  }

  async read(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', Number(id))
      .maybeSingle();

    if (error || !data) return null;
    return this.mapearParaFrontend(data);
  }

  async create(cliente) {
    const payload = this.mapearParaBanco(cliente);
    payload.status = 'ativo';

    const { data, error } = await supabase
      .from('clientes')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapearParaFrontend(data);
  }

  async update(id, dadosAtualizados) {
    const payload = this.mapearParaBanco(dadosAtualizados);

    const { data, error } = await supabase
      .from('clientes')
      .update(payload)
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapearParaFrontend(data);
  }

  async delete(id) {
    return await this.update(id, { status: 'inativo' });
  }

  // 🧠 Traduz o React para as colunas exatas do seu Supabase (data_nascimento, genero, jsonb)
  mapearParaBanco(obj) {
    const resultado = {};
    if (obj.nome !== undefined) resultado.nome = obj.nome;
    if (obj.email !== undefined) resultado.email = obj.email;
    if (obj.cpf !== undefined) resultado.cpf = obj.cpf;
    if (obj.senha !== undefined) resultado.senha = obj.senha;
    if (obj.status !== undefined) resultado.status = obj.status;
    if (obj.telefone !== undefined) resultado.telefone = obj.telefone;
    if (obj.dataNascimento !== undefined) resultado.data_nascimento = obj.dataNascimento;
    if (obj.genero !== undefined) resultado.genero = obj.genero;
    if (obj.enderecos !== undefined) resultado.enderecos = obj.enderecos;
    if (obj.cartoes !== undefined) resultado.cartoes = obj.cartoes;
    return resultado;
  }

  // 🔄 Traduz o Supabase de volta para o React
  mapearParaFrontend(obj) {
    if (!obj) return null;
    return {
      id: Number(obj.id),
      nome: obj.nome,
      email: obj.email,
      cpf: obj.cpf,
      senha: obj.senha,
      status: obj.status,
      telefone: obj.telefone,
      dataNascimento: obj.data_nascimento,
      genero: obj.genero,
      enderecos: obj.enderecos || [],
      cartoes: obj.cartoes || []
    };
  }
}