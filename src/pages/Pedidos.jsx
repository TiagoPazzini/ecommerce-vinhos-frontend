// src/pages/Pedidos.jsx
import { usePedidosController } from '../controllers/usePedidosController'

// Dicionário de cores (Mantido na View pois é estritamente UI/CSS)
const statusCor = {
  'EM PROCESSAMENTO': { bg: '#FEF9C3', color: '#854D0E' },
  'APROVADA': { bg: '#F0FDF4', color: '#166534' },
  'REPROVADA': { bg: '#FEF2F2', color: '#991B1B' },
  'EM TRANSPORTE': { bg: '#EFF6FF', color: '#1E40AF' },
  'ENTREGUE': { bg: '#F0FDF4', color: '#14532D' },
}

export default function Pedidos() {
  const {
    pedidos,
    expandido,
    sucesso,
    toggleExpandido,
    formatarData,
    navigate
  } = usePedidosController()

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 60 }}>

      <div style={{ background: 'var(--wine-dark)', padding: '32px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--cream)', fontSize: 32, margin: 0 }}>
            Meus pedidos
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 32px' }}>

        {/* Mensagem de sucesso */}
        {sucesso && (
          <div style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8,
            padding: '16px 20px', marginBottom: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ color: '#166534', fontSize: 14 }}>
              ✓ Pedido realizado com sucesso! Em breve você receberá a confirmação.
            </span>
            <button onClick={() => navigate('/catalogo')} style={{
              background: 'var(--wine)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '10px 20px', fontSize: 13,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', marginLeft: 16
            }}>
              Continuar comprando
            </button>
          </div>
        )}

        {pedidos.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
            padding: '60px 32px', textAlign: 'center'
          }}>
            <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 24 }}>
              Você ainda não fez nenhum pedido.
            </p>
            <button onClick={() => navigate('/')} style={{
              background: 'var(--wine)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '12px 24px', fontSize: 14, cursor: 'pointer'
            }}>
              Explorar catálogo
            </button>
          </div>
        ) : (
          pedidos.map(pedido => (
            <div key={pedido.id} style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 12, marginBottom: 16, overflow: 'hidden'
            }}>
              {/* Cabeçalho do pedido */}
              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 4px' }}>
                    Pedido #{String(pedido.id).slice(-6)} · {formatarData(pedido.dataPedido)}
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>
                    {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'} · Frete R$ {pedido.frete?.toFixed(2)}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: statusCor[pedido.status]?.bg || '#F9FAFB',
                    color: statusCor[pedido.status]?.color || '#6B7280'
                  }}>
                    {pedido.status}
                  </span>
                  <span style={{
                    fontFamily: 'Playfair Display, serif', color: 'var(--wine)',
                    fontSize: 20, fontWeight: 700
                  }}>
                    R$ {pedido.total?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botão ver detalhes */}
              <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px' }}>
                <button onClick={() => toggleExpandido(pedido.id)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--wine)',
                    cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif'
                  }}>
                  {expandido === pedido.id ? '▲ Ocultar detalhes' : '▼ Ver detalhes'}
                </button>
              </div>

              {/* Detalhes expandidos */}
              {expandido === pedido.id && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', background: 'var(--cream)' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Itens</h3>
                  {pedido.itens.map(item => (
                    <div key={item.produto.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 13, color: 'var(--muted)', marginBottom: 6
                    }}>
                      <span>{item.produto.nome} × {item.quantidade}</span>
                      <span>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}

                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 8px' }}>Entrega</h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                    {pedido.enderecoEntrega?.logradouro}, {pedido.enderecoEntrega?.numero} — {pedido.enderecoEntrega?.cidade}/{pedido.enderecoEntrega?.estado}
                  </p>

                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 8px' }}>Pagamento</h3>
                  {pedido.formasPagamento?.cupons?.map(c => (
                    <p key={c.codigo} style={{ fontSize: 13, color: '#166534', margin: '0 0 4px' }}>
                      Cupom {c.codigo}: - R$ {c.valor.toFixed(2)}
                    </p>
                  ))}
                  {pedido.formasPagamento?.cartoes?.map(c => (
                    <p key={c.numero} style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 4px' }}>
                      {c.bandeira} •••• {c.numero.slice(-4)}: R$ {parseFloat(c.valor).toFixed(2)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}