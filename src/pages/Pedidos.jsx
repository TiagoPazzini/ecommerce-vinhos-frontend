import React, { useState, useEffect } from 'react'
import { usePedidosController } from '../controllers/usePedidosController'

export default function Pedidos() {
  const { pedidos, handleSolicitarTroca } = usePedidosController()
  const [expandedPedido, setExpandedPedido] = useState(null)
  
  // 📝 ESTADO DE RASCUNHO: Armazena o mapa de quantidades selecionadas para devolução { [pedidoId]: { [produtoId]: quantidade } }
  const [rascunhoDevolucao, setRascunhoDevolucao] = useState({})

  const toggleExpand = (id) => {
    setExpandedPedido(expandedPedido === id ? null : id)
  }

  // Função auxiliar para mudar a quantidade do rascunho de forma segura
  const handleMudarQtdRascunho = (pedidoId, produtoId, valor, maximo) => {
    const qtdValida = Math.max(0, Math.min(maximo, Number(valor)))
    setRascunhoDevolucao(prev => ({
      ...prev,
      [pedidoId]: {
        ...(prev[pedidoId] || {}),
        [produtoId]: qtdValida
      }
    }))
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px', fontFamily: 'DM Sans, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--wine)', marginBottom: 32 }}>Meus pedidos</h1>

      {pedidos.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 48 }}>Você ainda não realizou nenhum pedido.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pedidos.map(pedido => {
            const isExpanded = expandedPedido === pedido.id
            
            // Verifica se o usuário selecionou qualquer item deste pedido para devolver
            const selecaoAtual = rascunhoDevolucao[pedido.id] || {}
            const temItensSelecionados = Object.values(selecaoAtual).some(qtd => qtd > 0)

            return (
              <div key={pedido.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                
                {/* Cabeçalho do Card */}
                <div onClick={() => toggleExpand(pedido.id)} style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? '#F8FAFC' : '#fff' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: '#1E293B' }}>Pedido #{String(pedido.id).slice(-6)}</span>
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                        {pedido.dataPedido ? new Date(pedido.dataPedido).toLocaleDateString('pt-BR') : 'Data indisponível'}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'} · Frete R$ {Number(pedido.frete || 0).toFixed(2)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <span style={{ fontWeight: 700, color: 'var(--wine)', fontSize: 16 }}>R$ {Number(pedido.total || 0).toFixed(2)}</span>
                    <span style={{
                      padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                      background: pedido.status === 'ENTREGUE' ? '#DCFCE7' : pedido.status === 'EM TROCA' ? '#FEF3C7' : '#F1F5F9',
                      color: pedido.status === 'ENTREGUE' ? '#14532D' : pedido.status === 'EM TROCA' ? '#713F12' : '#475569'
                    }}>
                      {pedido.status}
                    </span>
                  </div>
                </div>

                {/* Detalhes Expandidos */}
                {isExpanded && (
                  <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0', background: '#FFF' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#1E293B' }}>Itens do Pedido</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                      {pedido.itens.map(item => (
                        <div key={item.produto.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--muted)', paddingBottom: 8, borderBottom: '1px dashed #F1F5F9' }}>
                          <div>
                            <span style={{ color: '#334155', fontWeight: 500 }}>{item.produto.nome}</span> × {item.quantidade}
                            {item.emTroca && (
                              <span style={{ marginLeft: 8, color: '#A16207', fontWeight: 600, background: '#FEF3C7', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>
                                ↩ Devolvido ({item.qtdTroca} un)
                              </span>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <span style={{ color: '#1E293B' }}>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                            
                            {/* 🔢 SELETOR EM LOTE: Aparece se o pedido estiver elegível e o item ainda não foi totalmente devolvido */}
                            {pedido.status === 'ENTREGUE' && !item.emTroca && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Devolver:</span>
                                <input 
                                  type="number"
                                  min="0"
                                  max={item.quantidade}
                                  value={selecaoAtual[item.produto.id] || 0}
                                  onChange={(e) => handleMudarQtdRascunho(pedido.id, item.produto.id, e.target.value, item.quantidade)}
                                  style={{ width: 48, padding: '3px', borderRadius: 4, border: '1px solid #CBD5E1', textAlign: 'center', fontSize: 12, fontWeight: 600 }}
                                />
                                <span style={{ fontSize: 11, color: '#94A3B8' }}>/ {item.quantidade}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Botão de Envio de Lote Único */}
                    {pedido.status === 'ENTREGUE' && temItensSelecionados && (
                      <button 
                        onClick={() => {
                          handleSolicitarTroca(pedido.id, selecaoAtual)
                          // Limpa o rascunho deste pedido após enviar
                          setRascunhoDevolucao(prev => ({ ...prev, [pedido.id]: {} }))
                        }}
                        style={{
                          width: '100%', background: 'var(--wine)', color: '#fff', border: 'none',
                          borderRadius: 6, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                          transition: 'background 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        ↩ Confirmar Devolução dos Itens Selecionados
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}