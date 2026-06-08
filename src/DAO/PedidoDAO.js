import { IDAO } from './interfaces/IDAO';
import { supabase } from '../services/supabaseClient';

export class PedidoDAO extends IDAO {
  async readAll() {
    const { data, error } = await supabase.from('pedidos').select('*');
    if (error) throw new Error(error.message);
    
    return data.map(p => ({
      id: Number(p.id),
      clienteId: p.cliente_id,
      clienteEmail: p.cliente_email, 
      itens: p.itens,
      enderecoEntrega: p.endereco_entrega,
      formasPagamento: p.formas_pagamento,
      frete: Number(p.frete || 0),
      subtotal: Number(p.subtotal || 0),
      descontoCupons: Number(p.desconto_cupons || 0),
      total: Number(p.total || 0),
      status: p.status,
      dataPedido: p.data_pedido     
    }));
  }

  async read(id) {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', Number(id))
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: Number(data.id),
      clienteId: data.cliente_id,
      clienteEmail: data.cliente_email,
      itens: data.itens,
      enderecoEntrega: data.endereco_entrega,
      formasPagamento: data.formas_pagamento,
      frete: Number(data.frete || 0),
      subtotal: Number(data.subtotal || 0),
      descontoCupons: Number(data.desconto_cupons || 0),
      total: Number(data.total || 0),
      status: data.status,
      dataPedido: data.data_pedido
    };
  }

  async create(pedido) {
    const { data, error } = await supabase
      .from('pedidos')
      .insert([{
        id: pedido.id,
        cliente_id: pedido.clienteId,
        cliente_email: pedido.clienteEmail,
        itens: pedido.itens,
        endereco_entrega: pedido.enderecoEntrega,
        formas_pagamento: pedido.formasPagamento,
        frete: pedido.frete,
        subtotal: pedido.subtotal,
        desconto_cupons: pedido.descontoCupons,
        total: pedido.total,
        status: pedido.status,
        data_pedido: pedido.dataPedido
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    return {
      id: Number(data.id),
      clienteId: data.cliente_id,
      clienteEmail: data.cliente_email,
      itens: data.itens,
      enderecoEntrega: data.endereco_entrega,
      formasPagamento: data.formas_pagamento,
      frete: Number(data.frete || 0),
      subtotal: Number(data.subtotal || 0),
      descontoCupons: Number(data.desconto_cupons || 0),
      total: Number(data.total || 0),
      status: data.status,
      dataPedido: data.data_pedido
    };
  }

  async update(id, dadosAtualizados) {
    const payload = { ...dadosAtualizados };
    if (payload.clienteId) { payload.cliente_id = payload.clienteId; delete payload.clienteId; }
    if (payload.clienteEmail) { payload.cliente_email = payload.clienteEmail; delete payload.clienteEmail; }
    if (payload.enderecoEntrega) { payload.endereco_entrega = payload.enderecoEntrega; delete payload.enderecoEntrega; }
    if (payload.formasPagamento) { payload.formas_pagamento = payload.formasPagamento; delete payload.formasPagamento; }
    if (payload.descontoCupons) { payload.desconto_cupons = payload.descontoCupons; delete payload.descontoCupons; }
    if (payload.dataPedido) { payload.data_pedido = payload.dataPedido; delete payload.dataPedido; }

    const { data, error } = await supabase
      .from('pedidos')
      .update(payload)
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: Number(data.id),
      clienteId: data.cliente_id,
      clienteEmail: data.cliente_email,
      itens: data.itens,
      enderecoEntrega: data.endereco_entrega,
      formasPagamento: data.formas_pagamento,
      frete: Number(data.frete || 0),
      subtotal: Number(data.subtotal || 0),
      descontoCupons: Number(data.desconto_cupons || 0),
      total: Number(data.total || 0),
      status: data.status,
      dataPedido: data.data_pedido
    };
  }
  
  async delete(id) {
    throw new Error("Pedidos não podem ser deletados fisicamente");
  }
}